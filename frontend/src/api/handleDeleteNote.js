import toast from "react-hot-toast";
import api from "../lib/axios";
/*
Why this works:
- It accepts an object with optional setNotes and navigate 
- Can be used both in the notes list and note detail
- Keeps logic in one place
*/
const handleDeleteNote = async ({ id, setNotes = null, navigate = null }) => {
  if (!id) {
    toast.error("Couldn't find the note");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this note?"
  );
  if (!confirmed) return;

  try {
    await api.delete(`/notes/${id}`);

    if (setNotes) {
      setNotes((prev) => prev.filter((note) => note._id !== id));
    }

    if (navigate) {
      toast.success("Note deleted successfully!");
      navigate("/");
    } else {
      toast.success("Note deleted successfully!");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong while deleting the note.");
  }
};

export default handleDeleteNote;
