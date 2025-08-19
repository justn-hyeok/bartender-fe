import { useState } from "react";
import { MainFrame, Sidebar } from "./components";
import "./assets/styles/base.css";
import "./assets/styles/fonts.css";
import "./App.css";

export type PageType = "새 대화" | "앱 연결" | "할 일" | "new";

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>("새 대화");

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <MainFrame currentPage={currentPage} />
    </div>
  );
}

export default App;
