# 📘 STEP 1: Understanding the `User` Model in a MERN App

## ✅ Purpose

We define a Mongoose model for the `User`, which:

- Stores each user's `username`, `email`, and `password`
- Ensures passwords are **hashed** before saving to MongoDB
- Supports secure user registration and login

---

## 📁 File: `models/User.js`

```js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1. Create the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Must be provided
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Must be provided
      unique: true, // No two users can have the same email
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email", // Valid email format
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// 2. Pre-save middleware to hash password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash password if it was modified or newly set
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with bcrypt (10 salt rounds)
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 3. Instance method to compare raw password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Export the model
const User = mongoose.model("User", userSchema);
export default User;
```

## 🧱 Breakdown

### 1. mongoose and bcrypt

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
```

**mongoose**: A library to define schemas and models for MongoDB.

**bcrypt**: A library to hash passwords so they’re stored securely.

### 2. What does required: [true, "Username is required"] mean?

It's a Mongoose validation rule that does two things:

1. Enforces that username is required
   Mongoose will not allow saving a document unless this field is provided.

Equivalent to: required: true

2. Sets a custom error message
   If the field is missing, Mongoose will throw a validation error using the message:
   ➤ "Username is required"

**🔍 Why use the array form?**
You can write required in two ways:

_✅ Simple form:_

```js
required: true;
```

Mongoose will throw a default error message like:

"Path username is required."

_✅ Array form:_

```js
required: [true, "Username is required"];
```

Now you control the error message shown if the field is missing — much better for UX and API clarity.

🔧 Example
Let's say you try to create a user without a username:

```js
await User.create({
  email: "riya@example.com",
  password: "abc123",
});
```

You’ll get this error:

```json
{
  "message": "User validation failed: username: Username is required"
}
```

### 3. 🟡 What does unique: true mean in Mongoose?

When you write:

```js

email: {
  type: String,
  required: [true, "Email is required"],
  unique: true
}
```

You're telling MongoDB:

“Make sure no two users can have the same email.”

It creates a unique index in your database.

❌ But here's the catch:
_unique: true_ is not a validator like _required_ or _minlength_.
That means:

**It won’t throw a “validation” error.**

**Instead, MongoDB will throw an error with code 11000 if you try to insert a duplicate.**

**🧪 Example:**

Let’s say user 1 signs up:

```js

await User.create({ email: "riya@example.com", ... });
```

Then user 2 tries the same email:

```js

await User.create({ email: "riya@example.com", ... });
```

You’ll get an error like this:

```json
{
  "code": 11000,
  "message": "E11000 duplicate key error collection: users index: email_1 dup key"
}
```

**✅ How to handle it properly:**
Use a try-catch block to check for that specific error code:

```js

try {
  await User.create({ email: "riya@example.com", ... });
} catch (error) {
  if (error.code === 11000) {
    return res.status(400).json({ message: "Email already exists" });
  }
  return res.status(500).json({ message: "Something went wrong" });
}
```

### 4. 🔒 Password Hashing Middleware

```js

  userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
  });
  ✅ What This Does:
  userSchema.pre('save'): Runs before saving a user to the database.

this.isModified('password'):
```

- Checks if password was changed.

- If not, it skips hashing.

- bcrypt.hash(this.password, 10):

- Hashes the password with 10 salt rounds.

**❓ Why is this check important?**

Without **_if (!this.isModified('password')) return next();_**, we might re-hash an already hashed password, causing:

- Broken login (hashed password becomes unusable)

- Users getting locked out

**Scenario What Should Happen**

- New user signs up Hash the password
- User changes password Hash the new password
- User updates only email/username Don’t hash again

**userSchema.methods.matchPassword**

```js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

- This is a custom instance method added to the User model — and it's used during user login to verify the entered password against the hashed password stored in the database.
- ✅ How It’s Used (in loginUser controller):

  - Here’s where it's used in your userController.js:

  ```js
    const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
  // Password is correct
  res.json({ ... });
  } else {
  res.status(401).json({ message: "Invalid credentials" });
  }
  ```

  - ✅ What's Happening Behind the Scenes?

  1. You find the user:

     ```js
     const user = await User.findOne({ email });
     ```

  2. You call the custom instance method:

     ```js
     await user.matchPassword(password);
     ```

     This does:

     ```js
     bcrypt.compare(password, user.password);
     ```

     - password: the plain-text password user just typed in.

     - user.password: the hashed password stored in MongoDB.

     - If they match, bcrypt.compare returns true.

  **✅ Why Use This Pattern?**

  - Adding matchPassword as a method on the schema:

  - Keeps logic clean and reusable.

  - Encapsulates hashing comparison logic in one place.

  - Makes your controller more readable.

**Exporting the Model**

```js

  const User = mongoose.model('User', userSchema);
  export default User;
  mongoose.model('User', userSchema) creates the actual User model
```

We export it to use in routes, controllers, etc.

# 📘 Step 2: Add user field to your Note model

- In models/Note.js, add:

```js
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}

```

- Full note model:

```js
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
```

- Let’s go over why we added a user field to the Note model in your MERN app.

- **🤔 Why did we do this?**
  This tells MongoDB and Mongoose:

  > Every note belongs to one user, and we want to store a reference to that user inside the note.

- **🔍 Let's break it down:**
  | Field Part | What it does |
  | -------------------------------------- | -------------------------------------------------------------------------- |
  | `type: mongoose.Schema.Types.ObjectId` | Stores a reference to another document (in this case: a user’s `_id`) |
  | `ref: "User"` | Tells Mongoose this ObjectId refers to a document in the `User` collection |
  | `required: true` | Makes sure a note **must** have an associated user |

- **🔗 How it connects the two**
  You now have a relationship between Note and User:

  - A note knows which user created it.

  - You can use this to:

    - Filter notes by user: Note.find({ user: req.user.\_id })

    - Prevent other users from accessing someone else’s notes.

    - Populate user info inside a note if needed: Note.find().populate("user")

# 📘 Step 3: Create Authentication Routes

- Create routes/userRoutes.js:

```js
import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);

export default router;
```

- Create controllers/userController.js:

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
```

- We’re adding routes for:

  - Register → To create a new user

  - Login → To let an existing user log in

  - Get Current User (/me) → To get info about the logged-in user

- These routes will live at:

```bash

/api/users/register
/api/users/login
/api/users/me
```

- **🛠 Why we need this step**

You want to:

- Let users sign up and log in

- Generate and return a JWT token

- Protect notes so only the logged-in user can access theirs

## 🔧 Step-by-Step Code + Explanation

### 1. routes/userRoutes.js

This file defines the API routes and connects them to the logic.

```js
import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users/register → for user signup
router.post("/register", registerUser);

// POST /api/users/login → for login
router.post("/login", loginUser);

// GET /api/users/me → for fetching current user's profile
// ✅ Protected using authMiddleware (token required)
router.get("/me", authMiddleware, getMe);

export default router;
```

> 🔒 Only the /me route is protected by middleware — register and login should be public.

### 2. controllers/userController.js

This file contains the logic for what each route does.

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to create token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
```

**🔹 a. Register a new user**

```js
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save new user
    const user = await User.create({ username, email, password });

    // Send back user info + token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
```

**🔹 b. Log in an existing user**

```js
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // Use method from User model to match hashed password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
```

**🔹 c. Get logged-in user’s profile**

```js
export const getMe = async (req, res) => {
  // req.user is set by authMiddleware using token
  const user = await User.findById(req.user.id).select("-password"); // remove password
  res.json(user);
};
```

# 📘 Step 4: Add authMiddleware

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  // Step 1: Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 2: Extract the token from the "Bearer token" format
      token = req.headers.authorization.split(" ")[1];

      // Step 3: Decode the token using your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 4: Find the user by decoded.id and attach to req.user
      req.user = await User.findById(decoded.id).select("-password");

      // Step 5: Continue to the next middleware or route
      next();
    } catch (err) {
      console.error("Token verification failed", err);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default authMiddleware;
```

**🔐 What is authMiddleware?**
It's a middleware function in Express that:

- Reads the token sent by the frontend.

- Verifies the token to make sure it’s valid.

- Decodes the token to extract the user's ID.

- Finds the user in the DB and attaches them to req.user.

- Calls next() if everything is okay.

## 🧠 Let’s break it down step by step

### Step 1: Checking the header

```js
req.headers.authorization && req.headers.authorization.startsWith("Bearer");
```

This ensures that:

- A token exists.

- It is sent in the correct format:

```bash
  Authorization: Bearer <token>
```

### Step 2: Extract the token

```js
token = req.headers.authorization.split(" ")[1];
```

The header looks like:

```makefile

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

We split it by space and get:

- [0] = "Bearer"

- [1] = "actual-token"

**So we extract the token string.**

### Step 3: Verify the token

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

This:

- Uses your secret (JWT_SECRET) to verify that the token wasn't tampered with.

- If valid, it decodes the token and gives you:

```js
{
  "id": "someUserId",
  "iat": 1234567890,
  "exp": 1234567999
}
```

### Step 4: Get the user from DB

```js
req.user = await User.findById(decoded.id).select("-password");
```

- Now you fetch the actual user document from MongoDB.

- select("-password") ensures password isn't included.

- Attach it to req.user so you can use it in any protected route.

- Now, in your controllers, you can use req.user.\_id, req.user.email, etc.

### Step 5: Call next() to proceed

```js
next();
```

- If everything went well, call next() so that Express moves to the route handler.

**🚫 What if the token is missing or invalid?**

- No token → 401 Not authorized, no token

- Invalid token → 401 Invalid token

So, users can’t access protected routes unless they provide a valid token.

**✅ Where do we use this middleware?**
In any route that should be protected, like your /notes:

```js
router.use(authMiddleware); // Applies to all routes below
```

Now, routes like:

```js
router.post("/", createNote);
router.get("/", getAllNotes);
```

…will only work if the user is logged in and provides a token.

### Frontend Example (React + Axios)

Here’s how your frontend should send the token:

```js
axios.get("/api/notes", {
  headers: {
    Authorization: `Bearer ${userToken}`,
  },
});
```

Where userToken is the JWT stored in localStorage after login.

**🧪 Example Flow:**

1. Riya registers on /api/users/register

2. Server hashes the password and stores her details

3. Server sends back a JWT token

4. That token is saved in localStorage or cookies

5. Next time, Riya sends the token in headers:

```js

Authorization: Bearer <token>
```

6. Middleware reads the token and adds req.user

7. Protected routes like /api/notes can now use req.user.\_id

✅ In your server.js
Don’t forget to mount the route:

```js
import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);
```

# 📘 Step 5: Modify Note Controllers to be User-Specific

**🧠 Why are we doing this?**

- Now that each note belongs to a user (via user: ObjectId), we want to make sure:

- When a user creates a note ➝ it’s saved with their user ID.

- When a user fetches notes ➝ they only see their own notes.

- When a user updates or deletes a note ➝ they can’t touch others' notes.

- So we update all our note controllers to work with req.user.\_id, which is set by authMiddleware from the JWT.

## Your Updated Controller Functions

### 1. createNote — Add user to the note

```js
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user._id, // 🔥 Tie the note to the logged-in user
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

### 2. getAllNotes — Return only logged-in user’s notes

```js
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

### 3. getNoteById — Only if note belongs to user

```js
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    // 🔒 Prevent access to other users' notes
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

### 4. updateNote — Only if user owns it

```js
export async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

### 5. deleteNote — Only if user owns it

```js
export async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

**🧪 What does this achieve?**
| Action | Who can do it |
| ----------- | ------------------- |
| Create Note | Any logged-in user |
| View Notes | Only their own |
| Edit Note | Only if they own it |
| Delete Note | Only if they own it |

- This is essential for apps like Google Keep, Notion, or any app that stores user-specific data.

# Step 6: Protect Note Routes

Update routes/notesRoutes.js:

```js
import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // protect all note routes only, everything below it will be protected

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
```

# Step 7: Add /api/users to your server.js

```js
import userRoutes from "./routes/userRoutes.js";

// ...
app.use("/api/users", userRoutes);
```

# Step 8: Frontend Changes

In the React app:

- Add login/register UI

- On login, store JWT in localStorage

- On requests to protected routes (like create note), send:

```bash

Authorization: Bearer <token>
```

- You can use Axios interceptors to automatically attach it.

**🎯 Goal**
To update your React frontend so that:

- Users can register and login.

- Once logged in, a JWT token is stored on the client (in localStorage).

- The token is sent with every request to protected backend routes (like creating or viewing notes).

- You display only that user’s notes after logging in.

## 🧱 What changes are needed?

We'll break this down into parts:

### 1. Login & Register Forms

These forms should send POST requests to:

- POST /api/users/register → for registering new users

- POST /api/users/login → to log in and get a token

- Example (Login form):

```js
const loginUser = async () => {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("userToken", data.token); // ⬅️ store the JWT
    localStorage.setItem("userInfo", JSON.stringify(data)); // optional
  } else {
    alert(data.message);
  }
};
```

### 2. Send token with every request

Once a user logs in, you must include the token in the headers of all protected routes like:

- GET /api/notes

- POST /api/notes

- PUT /api/notes/:id

- DELETE /api/notes/:id

- Example (Fetch Notes):

```js
const getNotes = async () => {
  const token = localStorage.getItem("userToken");

  const res = await fetch("/api/notes", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ⬅️ required for protected routes
    },
  });

  const notes = await res.json();
  setNotes(notes);
};
```

### 3. Protect frontend pages (optional)

If you want to hide the Notes page unless the user is logged in:

```js
useEffect(() => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    navigate("/login");
  }
}, []);
```

### 4. Logout functionality

Simple way to log out:

```js
const handleLogout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
  navigate("/login");
};
```

**🔧 Bonus Tip: Axios instance**
If you're using Axios, you can create an instance that auto-sends token:

```js
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});
```

**But This will cause it to apply to all the api calls, we do not want it to apply for login, register apis. So to tackle that the concept of interceptors come in**

- If you directly include the token in your **axios.create()** instance like this:

```js
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`, // ❌
  },
});
```

…it will cause a problem when:

- The user is not logged in yet (i.e. userToken is null)

- You're making public requests like /login or /register

- The server sees Authorization: Bearer null — which could break your protected routes

### Solution: Use an interceptor to add the token only when needed

**🔎 What is an interceptor in Axios?**

> Think of an interceptor as a middleware that runs before or after every request/response made using Axios.

It helps you intercept and modify:

- 💡 the request before it's sent

- 📦 the response before it reaches your .then() or try/catch

**🔧 Why do we use Axios interceptors?**

You're building a secure MERN app where:

- Users must send a token with every protected route.

- You don’t want to manually attach the token in every API call.

- You may want to auto-logout the user if the token expires (401).

That’s where interceptors come in.

### 🔁 Two Types of Interceptors

**_1️⃣ Request Interceptor — runs before request is sent_**
This is where we attach the token dynamically:

```js
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

Now every request (except login/register) will automatically include the token without you having to write it each time.

**_2️⃣ Response Interceptor — runs after getting the response_**

Used for:

- Handling errors (like expired token)

- Showing global toast messages

- Logging/debugging

Example: Auto logout on 401 (unauthorized)

```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);
```

**🧠 Real-world Analogy**
Imagine you’re sending letters to a secure company:

- 📮 Request Interceptor is like putting your ID card (token) in the envelope before mailing it.

- 📬 Response Interceptor is like checking the reply when it comes back — and taking action if it says “access denied”.

**✅ Summary Table**
| Interceptor Type | When It Runs | Common Use |
| ---------------- | ------------------------ | -------------------------- |
| `request.use()` | Before sending request | Add token, custom headers |
| `response.use()` | After receiving response | Handle errors, auto-logout |

**💻 Where do you define interceptors?**
Right in your axios.js or api.js file when creating the Axios instance:

```js
const api = axios.create({ baseURL: "/api" });

// Add interceptors here 👇
```

Then use this api instance throughout your app.

=>OUR USECASE:Instead of setting the token statically, you can dynamically attach it just before the request is sent:

- Update your Axios instance:

```js
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Interceptor to attach token to each request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

💡 Benefits:
| ✅ | Why this is better |
| - | --------------------------------------------------------------------- |
| ✅ | Adds token **only if** it exists |
| ✅ | Keeps login/register requests **clean** (no token) |
| ✅ | Works automatically for **all requests** after login |
| ✅ | Keeps code DRY — you don’t have to manually set headers in every call |

**🔁 Example usage**

Now you can just use your api instance like this:

```js
await api.post("/users/login", { email, password }); // no token needed

await api.get("/notes"); // token added automatically via interceptor
```

# Step 9: Add .env Variable

In .env:

```ini

JWT_SECRET=your_jwt_secret_key
```
