import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css'
import { redirect } from 'next/navigation';
import ContainerDatos from '@/components/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/containers/fichaje/ContainerFichaje';
import SidebarPerfil from '@/components/perfil/SidebarPerfil';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    return (
        <>
            <div className={styles.containerSuperior}>
                <ContainerDatos user={user} />
                <ContainerFichaje user={user}/>
            </div>

            <div className={styles.content}>
                <SidebarPerfil />
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>

        </>
    );
}
