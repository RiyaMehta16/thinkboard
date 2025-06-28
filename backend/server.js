import express from "express";

const app = express();

app.get("/api/notes", (req, res) => {
  // http://localhost:5001/api/notes will return us "You got 5 notes" in the browser
  res.status(200).send("You got 10 notes");
});

// to create something, post is used
app.post("/api/notes", (req, res) =>
  res
    .status(201)
    .json({ message: "A new note using post is created successfully" })
);
// to update something, put is used
app.put("/api/notes/:id", (req, res) => {
  res.status(200).json({ message: "Note updated using put successfully" });
});
//delete note
app.delete("/api/notes/:id", (req, res) => {
  res.status(200).json({ message: "Note Deleted successfully" });
});
app.listen(5001, () => console.log("Server started on port 5001"));
