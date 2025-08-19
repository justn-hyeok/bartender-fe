import { useState } from 'react';
import styles from './ChatForm.module.css';
import TagButton from './TagButton';

const imgFrame47 = "http://localhost:3845/assets/289b711229164d93542ff2b3a2d78097b4197e4e.svg";
const imgFrame46 = "http://localhost:3845/assets/ca5a75c6eef6607c9302e134d015bbbefe685063.svg";

interface ChatFormProps {
  onSubmit?: (message: string) => void;
}

export default function ChatForm({ onSubmit }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
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
            placeholder="오늘은 어떤 도움을 드릴까요?"
            className={styles.textInput}
          />
        </div>
        <div className={styles.buttonRow}>
          <div className={styles.leftButtons}>
            <div className={styles.iconButton}>
              <img src={imgFrame47} alt="+" className={styles.iconImage} />
            </div>
            <TagButton>앱 연결</TagButton>
            <TagButton>할 일</TagButton>
          </div>
          <button type="submit" className={styles.submitButton}>
            <img src={imgFrame46} alt="전송" className={styles.iconImage} />
          </button>
        </div>
      </div>
    </form>
  );
}