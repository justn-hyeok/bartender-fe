import { useState, useEffect } from 'react';
import type { PageType } from '../../App';
import { ConversationStorage, type Conversation, type Message } from '../../utils/conversationStorage';
import styles from './Sidebar.module.css';

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
  return (
    <button
      className={`${styles.sidebarItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {icon && (
        <div className={styles.iconContainer}>
          <span className={styles.iconText}>{icon}</span>
        </div>
      )}
      <span className={styles.labelText}>{label}</span>
    </button>
  );
}

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onAddConversation?: (addFunction: (name: string, firstMessage?: Message) => string) => void;
}

type ActiveMenu = '앱 연결' | '할 일' | '새 대화' | string;

export default function Sidebar({ currentPage, setCurrentPage, onAddConversation }: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(currentPage);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', name: '대화 1' },
    { id: '2', name: '대화 2' },
    { id: '3', name: '대화 3' },
    { id: '4', name: '대화 4' }
  ]);

  const handleMenuClick = (menu: ActiveMenu) => {
    setActiveMenu(menu);
    
    // 대화인 경우 ID로 페이지 설정, 그 외에는 메뉴 이름으로 설정
    const conversation = conversations.find(conv => conv.name === menu);
    if (conversation) {
      setCurrentPage(conversation.id as PageType);
    } else {
      setCurrentPage(menu as PageType);
    }
  };

  const addConversation = (name: string) => {
    if (conversations.some(conv => conv.name === name)) {
      alert('이미 존재하는 대화 이름입니다.');
      return false;
    }
    
    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: name
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveMenu(uniqueName);
    setCurrentPage(newConversation.id as PageType);
    
    return newConversation.id;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.topSection}>
        <SidebarItem
          icon="ic"
          label="앱 연결"
          isActive={activeMenu === '앱 연결'}
          onClick={() => handleMenuClick('앱 연결')}
        />
        <SidebarItem
          icon="on"
          label="할 일"
          isActive={activeMenu === '할 일'}
          onClick={() => handleMenuClick('할 일')}
        />
        <SidebarItem
          icon="s"
          label="새 대화"
          isActive={activeMenu === '새 대화'}
          onClick={() => handleMenuClick('새 대화')}
        />
      </div>

      <div className={styles.conversationSection}>
        {conversations.map(conversation => (
          <SidebarItem
            key={conversation.id}
            icon=""
            label={conversation.name}
            isActive={activeMenu === conversation.name}
            onClick={() => handleMenuClick(conversation.name)}
          />
        ))}
      </div>
    </div>
  );
}
