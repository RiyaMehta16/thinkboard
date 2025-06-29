//Note.js =>Singular name with starting with Capital letter
import mongoose from "mongoose";

//1- CREATE A SCHEMA
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // here we could have added timestamp
  },
  //but mongodb by default provides "createdAt" and "updatedAt" timesta,mps by default, so we added that "timestamps : true" as a separate object to access those from mongodb
  { timestamps: true }
);
//2- MODEL based off of THAT schema
const Note = mongoose.model("Note", noteSchema);

export default Note;
//we will be using this note to interact with the Note Collection => get, create, update, delete
