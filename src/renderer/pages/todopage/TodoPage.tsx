import { useState } from 'react';
import styles from './TodoPage.module.css';
import type { TodoItem } from '../../types/todo';
import { useTodos } from '../../hooks/useTodos';
import FilterButton from './components/FilterButton';
import CategorySection from './components/CategorySection';

export default function TodoPage() {
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const { todos, loading, error, completeTodo, deleteTodo } = useTodos();

  // 실제 할 일이 있는 카테고리만 추출
  const availableTodos = todos.filter(todo => !todo.completed);
  const availableCategories = ['전체', ...new Set(availableTodos.map(todo => todo.category))];

  const filteredTodos = activeFilter === '전체' 
    ? availableTodos
    : availableTodos.filter(todo => todo.category === activeFilter);

  const groupedTodos = filteredTodos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, TodoItem[]>);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>할 일</h1>
        <div className={styles.filterButtons}>
          {availableCategories.map(category => (
            <FilterButton
              key={category}
              category={category}
              isActive={activeFilter === category}
              onClick={setActiveFilter}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>할 일 목록을 불러오는 중...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : activeFilter === '전체' ? (
          Object.entries(groupedTodos).map(([category, categoryTodos]) => (
            <CategorySection
              key={category}
              category={category}
              todos={categoryTodos}
              onComplete={completeTodo}
              onDelete={deleteTodo}
            />
          ))
        ) : filteredTodos.length > 0 ? (
          <CategorySection
            category={activeFilter}
            todos={filteredTodos}
            onComplete={completeTodo}
            onDelete={deleteTodo}
          />
        ) : (
          <div className={styles.emptyState}>
            {activeFilter} 카테고리에 할 일이 없습니다.
          </div>
        )}
      </div>
      
      <div className={styles.scrollbar} />
    </div>
  );
}