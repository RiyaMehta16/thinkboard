import React, { useEffect, useState } from "react";
import handleUpdateNote from "../api/handleUpdateNote";
import { Link, useNavigate } from "react-router";
import handleGetNote from "../api/handleGetNote";
import { useParams } from "react-router";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import handleDeleteNote from "../api/handleDeleteNote";

const NoteDetailPage = () => {
  const { id } = useParams();
  // the name "id" here is based off of what we used while defining the Route, in our case we used "/notes/:id", if it was "notes/:user_id" then we would have used const { user_id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getNote = async () => {
      setLoading(true);
      try {
        const res = await handleGetNote(id);
        console.log("res.data", res.data);
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
          <div className="flex justify-between">
            <Link to={"/home"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" /> Back to Notes
            </Link>

            <button
              onClick={() => handleDeleteNote({ id, navigate })}
              className="btn btn-outline btn-error mb-6"
            >
              <Trash2Icon className="size-5" /> Delete Note
            </button>
          </div>
          <div className="">
            <div className="">
              <form onSubmit={(e) => handleUpdate(e)}>
                <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
                  <legend className="fieldset-legend ml-2 text-xl">
                    Update Note
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
                      {loading ? "Updating..." : "Update Note"}
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

export default NoteDetailPage;
