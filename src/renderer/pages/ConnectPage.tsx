import React, { useState } from 'react';
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
}

function ConnectPage() {
  const [appStates, setAppStates] = useState<Record<number, AppState>>({
    1: { status: 'disabled', statusText: '비활성화' },
    2: { status: 'pending', statusText: '읽기 전용' },
    3: { status: 'active', statusText: '활성화' }
  });

  const categories = [
    { id: 'all', label: '전체', active: true },
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
      hasState: true
    },
    {
      id: 2,
      title: '구글 캘린더',
      description: '사용자의 구글 캘린더에 접근합니다.',
      hasState: true
    },
    {
      id: 3,
      title: 'GMAIL',
      description: '사용자의 GMAIL 받은메세지에 조회합니다.',
      hasState: true
    }
  ];

  const computerApps: App[] = [
    {
      id: 4,
      title: '파일 읽기',
      description: '사용자의 파일에 접근하여 읽습니다.',
      status: 'toggle'
    },
    {
      id: 5,
      title: '파일 쓰기',
      description: '사용자의 파일에 접근하여 작성합니다.',
      status: 'toggle'
    },
    ...Array(4).fill(null).map((_, i) => ({
      id: 6 + i,
      title: '이름',
      description: '본문본문본문본문본문본문본문본문본문본문본문본문본문본문본문...',
      status: 'toggle' as const
    }))
  ];

  const googleApps: App[] = [
    {
      id: 10,
      title: '구글 캘린더',
      description: '사용자의 구글 캘린더에 접근합니다.',
      status: 'toggle'
    },
    {
      id: 11,
      title: '스프레드시트',
      description: '사용자의 파일에 접근하여 작성합니다.',
      status: 'toggle'
    },
    {
      id: 12,
      title: '이름',
      description: '본문본문본문본문본문본문본문본문본문본문본문본문본문본문본문...',
      status: 'toggle'
    }
  ];

  const cycleStatus = (appId: number) => {
    setAppStates(prev => {
      const current = prev[appId];
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
      const currentState = appStates[app.id];
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
      return (
        <div className={styles.toggleContainer}>
          <span className={styles.toggleLabel}>on/off switch</span>
          <div className={styles.toggleSwitch}>
            <div className={styles.toggleButton}></div>
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
                className={`${styles.categoryButton} ${category.active ? styles.active : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <Section title="인기" apps={popularApps} />
        <Section title="컴퓨터 접근" apps={computerApps} />
        <Section title="구글" apps={googleApps} />
      </div>
    </div>
  );
}

export default ConnectPage;
