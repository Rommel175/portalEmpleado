import styles from './ButtonLogin.module.css'
import { FaGoogle } from "react-icons/fa";

export default function ButtonLoginComponent() {
  return (
    <button className={styles.button}> <FaGoogle /> Inicia sesión</button>
  );
}