import { useState } from "react";
import { Sidebar } from "./components";
import ChatPage from "./pages/ChatPage";
import ConnectPage from "./pages/ConnectPage";
import NewPage from "./pages/NewPage";
import TodoPage from "./pages/TodoPage";
import "./assets/styles/base.css";
import "./assets/styles/fonts.css";
import "./App.css";

export type PageType = "chat" | "connect" | "todo" | "new";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("chat");

  const renderPage = () => {
    switch (currentPage) {
      case "chat":
        return <ChatPage />;
      case "connect":
        return <ConnectPage />;
      case "todo":
        return <TodoPage />;
      case "new":
        return <NewPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
