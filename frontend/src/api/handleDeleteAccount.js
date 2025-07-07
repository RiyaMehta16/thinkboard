import api from "../lib/axios";
import toast from "react-hot-toast";

const handleDeleteAccount = async ({ userId, navigate }) => {
  try {
    const res = await api.delete(`/users/${userId}`); // 🔐 Token automatically attached

    if (res.status === 200) {
      toast.success("Account deleted successfully");

      // Remove token from localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      // Redirect to login/home
      navigate("/register");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error(error?.response?.data?.message || "Unable to delete account");
  }
};
export default handleDeleteAccount;
