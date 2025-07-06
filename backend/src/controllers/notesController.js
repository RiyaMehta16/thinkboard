import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    // Return only logged-in user’s notes
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    // const notes = await Note.find().sort({ updatedAt: -1 }); //newest first
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
    const note = new Note({
      title: title,
      content: content,
      user: req.user._id, //  Tie the note to the logged-in user
    });
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
    const fetchedNote = await Note.findById(req.params.id);

    if (!fetchedNote)
      return res.status(404).json({ message: "Note not found" });
    // 🔒 Prevent access to other users' notes: comparing note's user_id with user_id in the jwt token
    if (fetchedNote.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    fetchedNote.title = req.body.title || fetchedNote.title;
    fetchedNote.content = req.body.content || fetchedNote.content;

    const updatedNote = await fetchedNote.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteNote(req, res) {
  try {
    const fetchedNote = await Note.findById(req.params.id);
    if (!fetchedNote)
      return res.status(404).json({ message: "Note not found" });
    // 🔒 Prevent access to other users' notes: comparing note's user_id with user_id in the jwt token
    if (fetchedNote.user.toString() !== req.user._id.toString) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await fetchedNote.deleteOne();
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

    // 🔒 Prevent access to other users' notes: comparing note's user_id with user_id in the jwt token
    if (fetchedNote.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to access the notes" });
    }

    res.status(200).json(fetchedNote);
  } catch (error) {
    console.error("Error in getNoteById controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
