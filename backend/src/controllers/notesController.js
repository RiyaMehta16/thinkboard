import Note from "../models/Note.js";

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }); //newest first
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createNote(req, res) {
  try {
    //parsing data
    const { title, content } = req.body;
    //creating a new note=> we could also use {title, content} since key-value pairs are same
    const note = new Note({ title: title, content: content });
    //storing it in the database
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function updateNote(req, res) {
  try {
    //getting data from frontend and parsing it
    const { title, content } = req.body;
    //find the note in database and update it
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
      },
      { new: true }
    );
    //const note= Model.findByIdAndUpdate(req.params.id, {data_to_be_updated}); <= returns the old note
    //const note= Model.findByIdAndUpdate(req.params.id, {data_to_be_updated}, {new:true}); <= returns the new note after updation
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(201).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getNoteById(req, res) {
  try {
    const fetchedNote = await Note.findById(req.params.id);
    if (!fetchedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json(fetchedNote);
  } catch (error) {
    console.error("Error in getNoteById controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
