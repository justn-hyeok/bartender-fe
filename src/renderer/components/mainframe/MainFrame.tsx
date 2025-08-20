import type { PageType } from "../../App";
import ChatPage from "../../pages/chat/ChatPage";
import ConnectPage from "../../pages/connect/ConnectPage";
import NewPage from "../../pages/new/NewPage";
import TodoPage from "../../pages/todopage/TodoPage";
import styles from "./MainFrame.module.css";

interface MainFrameProps {
  currentPage: PageType;
}

function MainFrame({ currentPage }: MainFrameProps) {
  const renderPage = () => {
    switch (currentPage) {
      case "앱 연결":
        return <ConnectPage />;
      case "할 일":
        return <TodoPage />;
      case "새 대화":
        return <NewPage />;
      default:
        return <ChatPage />;
    }
  };

  return <main className={styles.mainFrame}>{renderPage()}</main>;
}

export default MainFrame;
