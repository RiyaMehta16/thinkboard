import toast from "react-hot-toast";
import api from "../lib/axios";

const handleGetNote = async (id) => {
  try {
    const res = await api.get(`notes/${id}`);
    console.log(res);
    return res;
  } catch (error) {
    console.log("error to get note", error);
    toast.error("Unable to fetch the note");
  }
};
export default handleGetNote;
