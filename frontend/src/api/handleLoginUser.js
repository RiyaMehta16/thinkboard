import toast from "react-hot-toast";
import api from "../lib/axios";

const handleLoginUser = async ({ email, password, setLoading, navigate }) => {
  try {
    // Step 1: Validate input
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    // Step 2: Send login request
    const res = await api.post("/users/login", { email, password });

    if (res.status === 200) {
      localStorage.setItem("userToken", res.data.token);
      toast.success("Logged in successfully!");
      navigate("/home");
    } else {
      toast.error(res.data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);

    // Step 3: Handle different error cases
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong.";

      if (status === 401) {
        toast.error("Invalid email or password.");
      } else if (status === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error("No response from server. Please check your network.");
    } else {
      toast.error("Unexpected error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

export default handleLoginUser;
