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
      if (error.response?.status === 429) {
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
    <div className="min-h-screen bg-base-200 px-4 py-6">
      <div className="max-w-3xl mx-auto w-full">
        {/* Back Button */}
        <Link to="/home" className="btn btn-ghost mb-6 w-full sm:w-auto">
          <ArrowLeftIcon className="size-5 mr-2" />
          Back to Notes
        </Link>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
            <h1 className="font-bold text-center ml-2 text-xl">
              Create New Note
            </h1>
            <div className="m-4">
              <div className="form-control m-2">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-control mx-2">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered w-full h-32"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <div className="card-actions justify-center m-4">
              <button
                className="btn btn-primary w-full sm:w-auto"
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
  );
};

export default CreatePage;
