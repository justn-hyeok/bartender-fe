import { useState } from 'react';
import styles from './ChatForm.module.css';
import TagButton from '../tagbutton/TagButton';

import iconPlus from '../../assets/images/icon-plus.svg';
import iconSend from '../../assets/images/icon-send.svg';

interface ChatFormProps {
  onSubmit?: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatForm({ onSubmit, isLoading = false }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSubmit?.(message);
      setMessage('');
    }
  };

  return (
    <form className={styles.chatForm} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isLoading ? "AI가 응답 중입니다..." : "오늘은 어떤 도움을 드릴까요?"}
            className={styles.textInput}
            disabled={isLoading}
          />
        </div>
        <div className={styles.buttonRow}>
          <div className={styles.leftButtons}>
            <button type="button" className={styles.iconButton} disabled={isLoading}>
              <img src={iconPlus} alt="+" className={styles.iconImage} />
            </button>
            <TagButton>앱 연결</TagButton>
            <TagButton>할 일</TagButton>
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            <img src={iconSend} alt="전송" className={styles.iconImage} />
          </button>
        </div>
      </div>
    </form>
  );
}