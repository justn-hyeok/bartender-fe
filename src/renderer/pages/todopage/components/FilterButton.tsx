import styles from "./FilterButton.module.css";

interface FilterButtonProps {
  category: string;
  isActive: boolean;
  onClick: (category: string) => void;
}

export default function FilterButton({ category, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      className={`${styles.filterButton} ${isActive ? styles.active : styles.inactive}`}
      onClick={() => onClick(category)}
    >
      {category}
    </button>
  );
}
