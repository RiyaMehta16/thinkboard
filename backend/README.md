# 📘 Understanding the `User` Model in a MERN App

## ✅ Purpose

We define a Mongoose model for the `User`, which:

- Stores each user's `username`, `email`, and `password`
- Ensures passwords are **hashed** before saving to MongoDB
- Supports secure user registration and login

---

## 📁 File: `models/User.js`

```js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
```
