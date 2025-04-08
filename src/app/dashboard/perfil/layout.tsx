import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css'
import { redirect } from 'next/navigation';
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    return (
        <>
            <ContainerSuperior user={user}/>

            <div className={styles.content}>
                <NavbarPerfil />
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>

        </>
    );
}
