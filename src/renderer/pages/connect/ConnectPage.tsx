import React, { useState, useMemo } from 'react';
import styles from './ConnectPage.module.css';

interface AppState {
  status: 'disabled' | 'pending' | 'active';
  statusText: string;
}

interface App {
  id: number;
  title: string;
  description: string;
  hasState?: boolean;
  status?: 'toggle';
  category: string;
}

function ConnectPage() {
  const [appStates, setAppStates] = useState<Record<number, AppState>>({
    1: { status: 'disabled', statusText: '비활성화' },
    2: { status: 'pending', statusText: '읽기 전용' },
    3: { status: 'active', statusText: '활성화' },
    10: { status: 'pending', statusText: '읽기 전용' },
    11: { status: 'active', statusText: '활성화' },
    12: { status: 'active', statusText: '활성화' }
  });
  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'computer', label: '컴퓨터 접근' },
    { id: 'cloud', label: '구글' },
    { id: 'email', label: '메일' },
    { id: 'external', label: '외부' }
  ];

  const popularApps: App[] = [
    {
      id: 1,
      title: '파일 읽기/쓰기',
      description: '사용자의 파일에 접근합니다.',
      hasState: true,
      category: 'popular'
    },
    {
      id: 2,
      title: '구글 캘린더',
      description: '사용자의 구글 캘린더에 접근합니다.',
      hasState: true,
      category: 'popular'
    },
    {
      id: 3,
      title: 'GMAIL',
      description: '사용자의 GMAIL 받은메세지에 조회합니다.',
      hasState: true,
      category: 'popular'
    }
  ];

  const computerApps: App[] = [
    {
      id: 4,
      title: '파일 읽기',
      description: '사용자의 파일에 접근하여 읽습니다.',
      status: 'toggle',
      category: 'computer'
    },
    {
      id: 5,
      title: '파일 쓰기',
      description: '사용자의 파일에 접근하여 작성합니다.',
      status: 'toggle',
      category: 'computer'
    },
    ...Array(4).fill(null).map((_, i): App => ({
      id: 6 + i,
      title: '이름',
      description: '본문본문본문본문본문본문본문본문본문본문본문본문본문본문본문...',
      status: 'toggle',
      category: 'computer'
    }))
  ];

  const googleApps: App[] = [
    {
      id: 10,
      title: '구글 캘린더',
      description: '사용자의 구글 캘린더에 접근합니다.',
      hasState: true,
      category: 'cloud'
    },
    {
      id: 11,
      title: '스프레드시트',
      description: '사용자의 파일에 접근하여 작성합니다.',
      status: 'toggle',
      category: 'cloud'
    },
    {
      id: 11,
      title: '구글 드라이브',
      description: '사용자의 구글 드라이브에 접근합니다.',
      status: 'toggle',
      category: 'cloud'
    }
  ];

  const emailApps: App[] = [
    {
      id: 12,
      title: 'GMAIL',
      description: '사용자의 GMAIL 받은메세지에 조회합니다.',
      hasState: true,
      category: 'email'
    },
    {
      id: 13,
      title: 'Outlook',
      description: '사용자의 Outlook 메일에 접근합니다.',
      status: 'toggle',
      category: 'email'
    },
    {
      id: 14,
      title: 'Yahoo Mail',
      description: '사용자의 Yahoo 메일에 접근합니다.',
      status: 'toggle',
      category: 'email'
    },
    {
      id: 15,
      title: 'Apple Mail',
      description: '사용자의 Apple Mail에 접근합니다.',
      status: 'toggle',
      category: 'email'
    }
  ];

  const externalApps: App[] = [
    {
      id: 16,
      title: 'Slack',
      description: 'Slack 워크스페이스에 접근합니다.',
      status: 'toggle',
      category: 'external'
    },
    {
      id: 17,
      title: 'Discord',
      description: 'Discord 서버에 접근합니다.',
      status: 'toggle',
      category: 'external'
    },
    {
      id: 18,
      title: 'Notion',
      description: 'Notion 워크스페이스에 접근합니다.',
      status: 'toggle',
      category: 'external'
    }
  ];

  const allApps = useMemo(() => 
    [...popularApps, ...computerApps, ...googleApps, ...emailApps, ...externalApps],
    [popularApps, computerApps, googleApps, emailApps, externalApps]
  );

  // appStates에서 직접 상태 가져오기

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleSwitch = (appId: number) => {
    setToggleStates(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }));
  };

  const filteredApps = useMemo(() => {
    if (activeCategory === 'all') {
      return allApps;
    }
    return allApps.filter(app => app.category === activeCategory);
  }, [activeCategory, allApps]);

  const cycleStatus = (appId: number) => {
    setAppStates(prev => {
      const current = prev[appId] || { status: 'disabled', statusText: '비활성화' };
      let newStatus: 'disabled' | 'pending' | 'active';
      let newStatusText: string;
      
      switch (current.status) {
        case 'disabled':
          newStatus = 'pending';
          newStatusText = '읽기 전용';
          break;
        case 'pending':
          newStatus = 'active';
          newStatusText = '활성화';
          break;
        case 'active':
          newStatus = 'disabled';
          newStatusText = '비활성화';
          break;
        default:
          newStatus = 'disabled';
          newStatusText = '비활성화';
      }
      
      return {
        ...prev,
        [appId]: { status: newStatus, statusText: newStatusText }
      };
    });
  };

  const getStatusBadge = (app: App) => {
    if (app.hasState) {
      const currentState = appStates[app.id] || { status: 'disabled', statusText: '비활성화' };
      return (
        <button
          onClick={() => cycleStatus(app.id)}
          className={`${styles.statusBadge} ${styles[currentState.status]}`}
        >
          {currentState.statusText}
        </button>
      );
    }

    if (app.status === 'toggle') {
      const isOn = toggleStates[app.id] || false;
      return (
        <div className={styles.toggleContainer}>
          <div 
            className={`${styles.toggleSwitch} ${isOn ? styles.toggleOn : ''}`}
            onClick={() => toggleSwitch(app.id)}
          >
            <div className={`${styles.toggleButton} ${isOn ? styles.toggleButtonOn : ''}`}></div>
          </div>
        </div>
      );
    }

    return null;
  };

  const AppCard: React.FC<{ app: App }> = ({ app }) => (
    <div className={styles.appCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{app.title}</h3>
        {getStatusBadge(app)}
      </div>
      <p className={styles.cardDescription}>{app.description}</p>
    </div>
  );

  const Section: React.FC<{ title: string; apps: App[] }> = ({ title, apps }) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.cardGrid}>
        {apps.map(app => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.connectPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>앱 연결</h1>
          
          {/* Category Filter */}
          <div className={styles.categoryFilter}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeCategory === 'all' ? (
          <>
            <Section title="인기" apps={popularApps} />
            <Section title="컴퓨터 접근" apps={computerApps} />
            <Section title="구글" apps={googleApps} />
            <Section title="메일" apps={emailApps} />
            <Section title="외부" apps={externalApps} />
          </>
        ) : (
          <Section 
            title={categories.find(c => c.id === activeCategory)?.label || ''} 
            apps={filteredApps} 
          />
        )}
      </div>
    </div>
  );
}

export default ConnectPage;
