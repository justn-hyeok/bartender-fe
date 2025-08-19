import type { TodoItem } from '../../../types/todo';
import TodoCard from './TodoCard';
import styles from './CategorySection.module.css';

interface CategorySectionProps {
  category: string;
  todos: TodoItem[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CategorySection({ category, todos, onComplete, onDelete }: CategorySectionProps) {
  return (
    <div className={styles.categorySection}>
      <h2 className={styles.categoryTitle}>{category}</h2>
      <div className={styles.todosContainer}>
        {todos.map(todo => (
          <TodoCard 
            key={todo.id}
            todo={todo}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}