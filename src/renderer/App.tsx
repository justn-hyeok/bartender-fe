import { useState } from "react";
import { MainFrame, Sidebar } from "./components";
import "./assets/styles/base.css";
import "./assets/styles/fonts.css";
import "./App.css";

export type PageType = "chat" | "connect" | "todo" | "new";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("chat");

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <MainFrame currentPage={currentPage} />
    </div>
  );
}

export default App;
