import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";

const App = () => {
  return (
    <div className="relative h-screen w-full max-sm:min-w-[300px]">
      {/* <div
        className="absolute inset-0 h-full w-full -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 65%, #f82b99 100%)",
        }}
      ></div> */}
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/home" element={<HomePage />} />

        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
