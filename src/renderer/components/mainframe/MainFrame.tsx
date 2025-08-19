import type { PageType } from "../../App";
import ChatPage from "../../pages/ChatPage";
import ConnectPage from "../../pages/ConnectPage";
import NewPage from "../../pages/NewPage";
import TodoPage from "../../pages/TodoPage";
import "./MainFrame.css";

interface MainFrameProps {
  currentPage: PageType;
}

function MainFrame({ currentPage }: MainFrameProps) {
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

  return <main className="main-frame">{renderPage()}</main>;
}

export default MainFrame;