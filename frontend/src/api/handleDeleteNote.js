import toast from "react-hot-toast";
import api from "../lib/axios";

const handleDeleteNote = async (e, id, setNotes) => {
  e.preventDefault();
  if (!window.confirm("Are you sure you want to delete this note?")) return;
  if (!id) {
    toast.error("Couldn't find the note");
    return;
  }
  try {
    await api.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((cur) => cur._id !== id)); //gets rid of the deleted note from notes array
    toast.success("Note has been deleted successfully!");
  } catch (error) {
    toast.error("Something went wrong, note couldn't be deleted");
    console.error(error);
  }
};
export default handleDeleteNote;
