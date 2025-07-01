import toast from "react-hot-toast";
import api from "../lib/axios";

const handleUpdateNote = async (e, id, title, content, navigate) => {
  e.preventDefault();
  //   if (!window.confirm("Are you sure you want save these changes?")) return;

  if (!title.trim() || !content.trim()) {
    toast.error("All fields are required!");
    return;
  }
  try {
    await api.put(`/notes/${id}`, { title, content });
    navigate("/");
  } catch (error) {
    toast.error("Unable to update note. Please try again later.");
    console.log("error while updating note...", error);
  }
};
export default handleUpdateNote;
