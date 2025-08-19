import * as React from 'react';
import { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import NewPage from './pages/newpage/NewPage';
import ConnectPage from './pages/ConnectPage';
import TodoPage from './pages/TodoPage';
import ChatPage from './pages/ChatPage';

export type PageType = '앱 연결' | '할 일' | '새 대화' | string;

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageType>('새 대화');

  const renderPage = () => {
    switch (currentPage) {
      case '새 대화':
        return <NewPage />
      case '앱 연결':
        return <ConnectPage />
      case '할 일':
        return <TodoPage />
      default:
        return <ChatPage />
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
