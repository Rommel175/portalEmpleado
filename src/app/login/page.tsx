import HeaderLoginComponent from '@/components/login/Header';
import styles from './login.module.css';
import ButtonLoginComponent from '@/components/login/ButtonLogin';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['600', '400', '500'],
    subsets:['latin']
})

export default function LoginPage() {
    return (
        <div className={`${styles.wraper} ${roboto.className}`}>
            <HeaderLoginComponent />

            <div className={styles.content}>
                <div className={styles.login}>
                    <div className={styles.title}>
                        <h1>Iniciar sesión</h1>
                        <h2>Accede fácilmente con tu cuenta de Google</h2>
                    </div>
                    <ButtonLoginComponent />
                </div>
            </div>
        </div>
    );
}