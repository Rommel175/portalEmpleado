import ContainerSuperior from "@/components/containers/containerSuperior/ContainerSuperior";
import { getUserData } from "@/lib/getSupabaseData";
import styles from './AddUser.module.css';
import FormularioAdd from "@/components/recursos/gestion/addUser/FormularioAdd";
import { redirect } from "next/navigation";

export default async function AddUser() {
    const { profile, fichaje, eventos } = await getUserData();

    if (!profile.is_admin) {
        redirect('/')
    }

    return (
        <>
            <div style={{ display: 'none' }}>
                <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
            </div>

            <div className={styles.wraper}>
                <div className={styles.header}>
                    Perfil
                </div>

                <FormularioAdd />
            </div>
        </>
    );
}