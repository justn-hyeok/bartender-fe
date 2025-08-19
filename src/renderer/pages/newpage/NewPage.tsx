import styles from './NewPage.module.css';
import Title from '../../components/title/Title';
import ChatForm from '../../components/chatform/ChatForm';

export default function NewPage() {
  const handleMessageSubmit = (message: string) => {
    console.log('메시지 전송:', message);
    // TODO: AI와 채팅 처리 로직
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title userName="부산소마고채찍피티조련마스터18세김현우" />
        <ChatForm onSubmit={handleMessageSubmit} />
      </div>
    </div>
  );
}