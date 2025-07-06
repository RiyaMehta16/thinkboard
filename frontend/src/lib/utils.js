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
