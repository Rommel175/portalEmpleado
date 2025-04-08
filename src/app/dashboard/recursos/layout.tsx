import NavbarRecursos from '@/components/recursos/NavbarRecursos';
import styles from './layput.module.css'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';

export default async function RecursosLayout({ children }: { children: React.ReactNode; }) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        redirect('/login')
    }

    const user = data.user;



    return (
        <div className={styles.wraper}>
            <NavbarRecursos />
            <div style={{display: 'none'}}>
                <ContainerSuperior user={user}/>
            </div>
            
            {children}
        </div>
    );
}