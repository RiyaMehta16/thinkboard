import mongoose from "mongoose";
import bcrypt from "bcrypt";

// 1. Create the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // Must be provided
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username must be at most 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Must be provided
      unique: true, // No two users can have the same email
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email", // Valid email format
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// 2. Pre-save middleware to hash password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash password if it was modified or newly set
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with bcrypt (10 salt rounds)
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 3. Instance method to compare raw password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Export the model
const User = mongoose.model("User", userSchema);
export default User;
