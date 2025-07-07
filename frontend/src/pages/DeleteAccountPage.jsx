import React from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

const DeleteAccountPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar link="create" linkName="New Note" icon="Plus" />
      <Modal />
    </div>
  );
};

export default DeleteAccountPage;
