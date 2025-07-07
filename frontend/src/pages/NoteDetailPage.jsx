import React, { useEffect, useRef, useState } from "react";
import handleUpdateNote from "../api/handleUpdateNote";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import handleGetNote from "../api/handleGetNote";
import handleDeleteNote from "../api/handleDeleteNote";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const calledOnce = useRef(false);

  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;
    const getNote = async () => {
      setLoading(true);
      try {
        const res = await handleGetNote(id);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getNote();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleUpdateNote(id, title, content, navigate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Top bar buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <Link to="/home" className="btn btn-ghost w-full sm:w-auto">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>

            <button
              onClick={() => handleDeleteNote({ id, navigate })}
              className="btn btn-outline btn-error w-full sm:w-auto"
            >
              <Trash2Icon className="size-5" />
              Delete Note
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate}>
            <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
              <legend className="fieldset-legend ml-2 text-xl">
                Update Note
              </legend>

              <div className="form-control m-4">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input w-full placeholder:pl-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-control m-4">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea w-full h-32 placeholder:pl-2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary w-full sm:w-auto"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Note"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
