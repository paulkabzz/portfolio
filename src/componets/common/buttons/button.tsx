import styles from './index.module.css';

interface IButton {
    label: string;
    onClick?: (e: any) => any;
    isLight?: boolean;
}

const Button: React.FC<IButton> = ({ label, onClick, isLight }) => {
  return (
    isLight ? (
        <button onClick={onClick} className={styles.buttonDefault}>
            { label }
        </button>
    ) : <button onClick={onClick} className={styles.buttonLight}>
        { label }
        </button>
  )
}

export default Button;