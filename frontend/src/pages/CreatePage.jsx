import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully!");
      navigate("/home");
    } catch (error) {
      console.log("error while creating note:", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast!", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" /> Back to Notes
          </Link>
          <div className="">
            <div className="">
              <form onSubmit={handleSubmit}>
                <fieldset
                  className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4"
                  onSubmit={handleSubmit}
                >
                  <legend className="fieldset-legend ml-2 text-xl">
                    Create New Note
                  </legend>
                  <div className="form-control m-4 ">
                    <label className="floating-label min-w-fit ml-2">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Note Title"
                      className="input w-lg placeholder:pl-2 "
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-control m-4 ">
                    <label className="floating-label min-w-fit ml-2">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      type="text"
                      placeholder="Write your note here..."
                      className="textarea w-lg h-32 placeholder:pl-2 "
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="card-actions justify-center">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Note"}
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
