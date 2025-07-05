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
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

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

### 2. Schema Definition

```js

  const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  }, { timestamps: true });
  Field Type Required? Unique? Purpose
  username String ✅ ✅ Used for display / identification
  email String ✅ ✅ Used to log in
  password String ✅ ❌ Stored in hashed form

timestamps: true adds createdAt and updatedAt fields automatically.
```

### 3. 🔒 Password Hashing Middleware

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

### ❓ Why is this check important?

Without **_if (!this.isModified('password')) return next();_**, we might re-hash an already hashed password, causing:

- Broken login (hashed password becomes unusable)

- Users getting locked out

### Scenario What Should Happen

- New user signs up Hash the password
- User changes password Hash the new password
- User updates only email/username Don’t hash again

### 4. Exporting the Model

```js

  const User = mongoose.model('User', userSchema);
  export default User;
  mongoose.model('User', userSchema) creates the actual User model
```

We export it to use in routes, controllers, etc.

### ✅ Summary

Secure user schema is created using Mongoose

Passwords are hashed only when needed

Fields are required and unique where necessary

Timestamps are automatically added
