import toast from "react-hot-toast";
export function formatDate(date) {
  date = new Date(date);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const isValidEmail = (email) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export const isStrongPassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};
export const handleLogout = (navigate) => {
  // Remove user token and any other persisted data
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");

  toast.success("Logged out successfully!");

  // Redirect to login page
  navigate("/login");
};
