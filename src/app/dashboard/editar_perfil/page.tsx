import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import styles from './editarPerfil.module.css';
import FormularioPerfil from "@/components/perfil/editarPerfil/FormularioPerfil";
import { getUserData } from '@/lib/getSupabaseData';

export default async function profilePage() {

    const { profile, fichaje, eventos } = await getUserData();

    return (
        <>
            <div style={{ display: 'none' }}>
                <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
            </div>

            <div className={styles.wraper}>
                <div className={styles.header}>
                    Perfil
                </div>

                <FormularioPerfil profile={profile} isAdmin={profile.is_admin} />
            </div>
        </>
    );
}