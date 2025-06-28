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
