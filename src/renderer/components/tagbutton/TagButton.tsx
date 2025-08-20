import styles from "./TagButton.module.css";

interface TagButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function TagButton({ children, onClick }: TagButtonProps) {
  return (
    <button type="button" className={styles.tagButton} onClick={onClick}>
      {children}
    </button>
  );
}
