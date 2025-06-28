export const getAllNotes = (req, res) => {
  res.status(200).send("You got 40 notes");
};
export const createNote = (req, res) => {
  res
    .status(201)
    .json({ message: "A new note using post is created successfully" });
};
export const updateNote = (req, res) => {
  res.status(200).json({ message: "Note updated using put successfully" });
};
export const deleteNote = (req, res) => {
  res.status(200).json({ message: "Note Deleted successfully" });
};
