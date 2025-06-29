# NOTES FOR MERN

## BACKEND

> 28 June 2025

1. install express
2. set up express app
3. set "type":"module" in package.json for import/export
4. install nodemon as a dev dependency: "npm install nodemon -D" for hot reload
5. set up scripts:
   "scripts": {
   "dev": "node server.js",
   "start": "nodemon server.js"
   },
6. Set up the routes

### Setting up the ROUTER

```
FILE STRUCTURE
-backend/
--server.js
|-node_modules/
|-routes/
---notesRoutes.js
```

**server.js Before creating the routes:**

```
import express from "express";

const app = express();

app.get("/api/notes", (req, res) => {
  res.status(200).send("You got 10 notes");
});


app.post("/api/notes", (req, res) =>
  res.status(201).json({ message: "A new note using post is created successfully" })
);

app.put("/api/notes/:id", (req, res) => {
  res.status(200).json({ message: "Note updated using put successfully" });
});

app.delete("/api/notes/:id", (req, res) => {
  res.status(200).json({ message: "Note Deleted successfully" });
});
app.listen(5001, () => console.log("Server started on port 5001"));

```

**server.js After creating the routes(notesRoutes.js):**

```
import express from "express";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

app.use("/api/notes", notesRoutes);

app.listen(5001, () => console.log("Server started on port 5001"));
```

**with notesRoutes.js:**

```
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("You got 10 notes");
});
router.post("/", (req, res) => {
  res.status(201).json({ message: "A new note using post is created successfully" });
});
router.put(":id", (req, res) => {
  res.status(200).json({ message: "Note updated using put successfully" });
});
router.delete(":id", (req, res) => {
  res.status(200).json({ message: "Note Deleted successfully" });
});

export default router;
```

Here, in server.js, we created app.use("/api/notes", notesRoutes). It means whenever a url starts with "/api/notes", we need to hit up "notesRoutes" file to see what block of code needs to be executed next based on the route and the http request method. In notesRoutes.js, there will be all the methods and teh corresponding block of codes/instructions that need to be executed for that method and url

### Setting up CONTROLLERS

These are the functions to be executed after a specific http request is sent to s specific url

```
router.get("/", controller);
```

### Remodularising code structure

```
-backend
---src/
-----controllers/
-------notesController.js
-----routes/
-------notesRoutes.js
-----server.js
```

> 29 June 2025

### Connecting with mongodb

```
npm install mongoose
```

=> Create a **config** folder
=> In it, create a **db.js** file
=> Go to mongodb and create a new project
=> Get the connection string and to name the database, in the connection string where "mongodb.net/?" is present, put the database name between the "/" and "?" as follows:

```
mongodb+srv://<db_user>:<db_password>@cluster0.abcdef.mongodb.net/database_name?retryWrites=true&w=majority&appName=Cluster0
```

=>**db.js**

```
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<db_user>:<db_password>@cluster0.abcdef.mongodb.net/database_name?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Error while connecting to mongodb, ", error);
    process.exit(1); //exit with failure
  }
};

```

But it is **insecure** to use credentials of mongodb directly in our code. For that we use a .env file in the backend folder

=>**.env**

```
MONGO_URI= "mongodb+srv://<db_user>:<db_password>@cluster0.abcdef.mongodb.net/database_name?retryWrites=true&w=majority&appName=Cluster0"
PORT=5001
```

So, to use this we need another package called "dotenv"

```
npm i dotenv
```

Using this package, we can access the ".env" file using **"process.env.VARIABLE_NAME"** after importing dotenv and calling config() function on dotenv:
=>**server.js**

```
import dotenv from "dotenv";
dotenv.config();
//everything will be accessible in all files because server.js serves as the entry point to the backend

```

=>**db.js**

```
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Error while connecting to mongodb, ", error);
    process.exit(1); //exit with failure
  }
};
```

### Creating Models For Database

=> To create Models, first create **models** folder and in that you create the schema and models
=> Keep in mind that the file name must be **Singular** and should start with **Capital Letter**(eg: Note.js and not: ~~note.js~~, ~~Notes.js~~ )
=> **Note.js**

```
import mongoose from "mongoose";
//1- CREATE A SCHEMA
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
    // here we could have added timestamp
  },
  //but mongodb by default provides "createdAt" and "updatedAt" timesta,mps by default, so we added that "timestamps : true" as a separate object to access those from mongodb
  { timestamps: true }
);
//2- MODEL based off of THAT schema
const Note = mongoose.model("Note", noteSchema);

export default Note;
//we will be using this note to interact with the Note Collection => get, create, update, delete

```
