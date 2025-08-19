import * as React from 'react';
import { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import NewPage from './pages/new/NewPage';
import ConnectPage from './pages/connect/ConnectPage';
import TodoPage from './pages/todopage/TodoPage';
import ChatPage from './pages/chat/ChatPage';
import type { Message } from './utils/conversationStorage';

export type PageType = '앱 연결' | '할 일' | '새 대화' | string;

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>('새 대화');
  const [addConversationFunction, setAddConversationFunction] = useState<((name: string, firstMessage?: Message) => string) | null>(null);

  const handleAddConversation = (addFunction: (name: string, firstMessage?: Message) => string) => {
    setAddConversationFunction(() => addFunction);
  };

  const renderPage = () => {
    switch (currentPage) {
      case '새 대화':
        return <NewPage onAddConversation={addConversationFunction} />
      case '앱 연결':
        return <ConnectPage />
      case '할 일':
        return <TodoPage />
      default:
        // 대화 이름으로 현재 페이지가 설정된 경우, 해당 대화 ID 찾기
        return <ChatPage conversationId={currentPage} />
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onAddConversation={handleAddConversation} />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
