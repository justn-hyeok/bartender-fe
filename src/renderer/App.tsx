import * as React from 'react';
import { useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import NewPage from './components/newpage/NewPage';

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>('새 대화');

  const renderPage = () => {
    switch (currentPage) {
      case '새 대화':
        return <NewPage />
      case '앱 연결':
        return (
          <div style={{ flex: 1, padding: '20px' }}>
            <h1 className="display">앱 연결</h1>
            <p className="body1">앱 연결 페이지입니다.</p>
          </div>
        );
      case '할 일':
        return (
          <div style={{ flex: 1, padding: '20px' }}>
            <h1 className="display">할 일</h1>
            <p className="body1">할 일 페이지입니다.</p>
          </div>
        );
      default:
        return (
          <div style={{ flex: 1, padding: '20px' }}>
            <h1 className="display">{currentPage}</h1>
            <p className="body1">{currentPage} 대화 페이지입니다.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
