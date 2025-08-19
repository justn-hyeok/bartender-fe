import styles from './Title.module.css';

interface TitleProps {
  userName: string;
}

export default function Title({ userName }: TitleProps) {
  return (
    <h1 className={styles.title}>
      {userName}님, 무엇을 도와드릴까요?
    </h1>
  );
}