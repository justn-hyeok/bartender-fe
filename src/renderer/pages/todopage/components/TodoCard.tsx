import { isAfter, parseISO, format } from 'date-fns';
import type { TodoItem } from '../../../types/todo';
import styles from './TodoCard.module.css';

interface TodoCardProps {
  todo: TodoItem;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({ todo, onComplete, onDelete }: TodoCardProps) {
  const isOverdue = () => {
    if (todo.completed) return false;
    try {
      const dueDate = parseISO(todo.dueDate);
      return isAfter(new Date(), dueDate);
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'yyyy.MM.dd');
    } catch {
      return dateString;
    }
  };

  const overdue = isOverdue();

  return (
    <div className={styles.todoCard}>
      <div className={styles.todoHeader}>
        <span className={styles.todoTitle}>{todo.title}</span>
        <span className={styles.todoPriority}>우선순위: {todo.priority}</span>
        {overdue && <span className={styles.overdueLabel}>마감일 초과</span>}
      </div>
      <div className={styles.todoContent}>{todo.content}</div>
      <div className={styles.todoFooter}>
        <div className={styles.todoMeta}>
          <span>시작일: {formatDate(todo.startDate)}</span>
          <span>마감일: {formatDate(todo.dueDate)}</span>
        </div>
        <div className={styles.todoActions}>
          <button 
            className={styles.deleteButton}
            onClick={() => onDelete(todo.id)}
          >
            삭제
          </button>
          <button 
            className={styles.completeButton}
            onClick={() => onComplete(todo.id)}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}