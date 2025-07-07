import toast from "react-hot-toast";
import api from "../lib/axios";
import { isValidEmail, isStrongPassword } from "../lib/utils.js";
const handleRegisterUser = async ({
  email,
  password,
  username,
  setLoading,
  navigate,
}) => {
  try {
    // Step 1: Validate input
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    // Step 2: API call
    const res = await api.post("/users/register", {
      username,
      email,
      password,
    });

    // Step 3: Handle success
    if (res.status === 201) {
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userId", res.data._id);

      toast.success("Registered successfully!");
      navigate("/home");
    } else {
      toast.error(res.data.message || "Registration failed.");
    }
  } catch (error) {
    // Step 4: Handle edge cases
    console.error("Register error:", error);
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message;

      if (status === 400 && msg === "User already exists") {
        toast.error("An account with this email already exists.");
      } else if (status === 429) {
        toast.error("Too many requests. Try again later.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(msg || "Registration failed. Try again.");
      }
    } else if (error.request) {
      toast.error("No response from server. Check your network.");
    } else {
      toast.error("Unexpected error occurred.");
    }
  } finally {
    // Step 5: Stop loader
    setLoading(false);
  }
};

export default handleRegisterUser;
