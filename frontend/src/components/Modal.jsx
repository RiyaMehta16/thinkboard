import { Trash2Icon } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import handleDeleteAccount from "../api/handleDeleteAccount";
const Modal = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const modal = document.getElementById("my_modal_2");
    if (modal) {
      modal.showModal(); // show on mount
    }
  }, []);
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_2" className="modal text-center ">
        <div className="modal-box text-error-content text-shadow-error-content bg-error-content">
          <h3 className="font-bold text-lg text-error">
            Are you sure you want to delete your account?
          </h3>
          <p className="py-4 text-error">
            All your notes will be deleted and you won't be able to retrieve
            them if you delete your account.
          </p>
          <button
            className="btn btn-error"
            onClick={() => handleDeleteAccount({ userId, navigate })}
          >
            <Trash2Icon className="size-5" />
            Delete my account permanently
          </button>
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => navigate("/home")}
        >
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Modal;
