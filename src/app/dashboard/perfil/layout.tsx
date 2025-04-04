import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css'
import { redirect } from 'next/navigation';
import ContainerDatos from '@/components/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/containers/fichaje/ContainerFichaje';
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerOptions from '@/components/containers/ContainerOptions';

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
                <NavbarPerfil />
                <div className={styles.mainContent}>
                    <ContainerOptions />
                    {children}
                </div>
            </div>

        </>
    );
}
