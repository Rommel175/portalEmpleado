import { User } from '@supabase/supabase-js';
import styles from './personalInfo.module.css';
import Image from 'next/image';

export default function PersonalInfoComponent( {user}: {user: User} ) {
    return (
        <div className={styles.profile}>
            <Image src={user.user_metadata.avatar_url} width={60} height={60} alt='img' className={styles.personalImage} />
            <div className={styles.personalInfo}>
                <h2>{user.user_metadata.full_name}</h2>
                <h3>UI/UX designer | {user.user_metadata.email}</h3>
            </div>
        </div>
    );
}