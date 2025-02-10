"use client";

import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/home";
import Chat from "./routes/chat";

export default function GarudaFAI() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
