import type { PageType } from "../../App";
import "./Sidebar.css";

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    { id: "chat" as PageType, label: "채팅" },
    { id: "connect" as PageType, label: "연결" },
    { id: "todo" as PageType, label: "할 일" },
    { id: "new" as PageType, label: "새로운" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Bartender</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
