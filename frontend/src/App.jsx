import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0 h-full w-full -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 65%, #f82b99 100%)",
        }}
      ></div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
