import FormularioPerfil from '@/components/perfil/editarPerfil/FormularioPerfil';
import styles from '../editarPerfil.module.css'
import { redirect } from 'next/navigation';
import { getUserData, getUsersProfile } from '@/lib/getSupabaseData';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';

export default async function profilesPage({ params }: { params: Promise<{ id: string }> }) {

    const { profile, fichaje, eventos } = await getUserData();

    let isAdmin = false;

    if (profile) {
        if (!profile.is_admin) {
            redirect('/');
        }
        isAdmin = profile.is_admin;
    }

    const { id } = await params;

    const profileUser = await getUsersProfile(id);



    return (
        <>
            <div style={{ display: 'none' }}>
                <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
            </div>

            <div className={styles.wraper}>
                <div className={styles.header}>
                    Perfil
                </div>

                <FormularioPerfil profile={profileUser} isAdmin={isAdmin} />
            </div>
        </>

    );
}