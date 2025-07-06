import { PenSquareIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router";
import { formatDate } from "../lib/utils";
import handleDeleteNote from "../api/handleDeleteNote";

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#ff64b7] "
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(note.updatedAt)}
          </span>
          <div className="flex items-center gap-1">
            <PenSquareIcon
              className="size-4"
              onClick={() => navigate(`/note/${note._id}`)}
            />
            <button
              className="btn btn-ghost btn-xs text-error z-20"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteNote({ id: note._id, setNotes });
              }}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
