import HeaderLogin from '@/components/login/HeaderLogin';
import styles from './login.module.css';
import ButtonLogin from '@/components/login/ButtonLogin';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    weight: ['600', '500', '400'],
    subsets:['latin']
})

export default function LoginPage() {
    return (
        <div className={`${styles.wraper} ${poppins.className}`}>
            <HeaderLogin />

            <div className={styles.container}>
                <form className={styles.form}>
                    <div className={styles.title}>
                        <h1>Iniciar sesión</h1>
                        <h2>Accede fácilmente con tu cuenta de Google</h2>
                    </div>
                    <ButtonLogin />
                </form>
            </div>
        </div>
    );
}