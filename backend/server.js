import express from "express";

const app = express();

app.get("/api/notes", (req, res) => res.send("You got 5 notes"));
// http://localhost:5001/api/notes will return us "You got 5 notes" in the browser

app.listen(5001, () => console.log("Server started on port 5001"));
