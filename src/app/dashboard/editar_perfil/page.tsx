import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from './editarPerfil.module.css';
import Image from "next/image";
import FormularioPerfil from "@/components/perfil/editarPerfil/FormularioPerfil";

export default async function profilePage() {

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

    if (errorProfile) {
        console.log('Error fetching Profile: ', errorProfile);
    }

    let profile = []

    if (dataProfile && dataProfile.length > 0) {
        profile = dataProfile;
    } else {
        await supabase.auth.signOut();
        redirect('/login');
    }

    return (
        <div className={styles.wraper}>
            <nav className={styles.nav}>
                <div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0505 2.36914C10.8494 2.36914 9.69748 2.84627 8.84817 3.69558C7.99887 4.54488 7.52174 5.69678 7.52174 6.89788C7.52174 8.09898 7.99887 9.25088 8.84817 10.1002C9.69748 10.9495 10.8494 11.4266 12.0505 11.4266C13.2516 11.4266 14.4035 10.9495 15.2528 10.1002C16.1021 9.25088 16.5792 8.09898 16.5792 6.89788C16.5792 5.69678 16.1021 4.54488 15.2528 3.69558C14.4035 2.84627 13.2516 2.36914 12.0505 2.36914ZM8.95186 6.89788C8.95186 6.07608 9.27832 5.28793 9.85943 4.70683C10.4405 4.12573 11.2287 3.79927 12.0505 3.79927C12.8723 3.79927 13.6604 4.12573 14.2415 4.70683C14.8226 5.28793 15.1491 6.07608 15.1491 6.89788C15.1491 7.71968 14.8226 8.50782 14.2415 9.08893C13.6604 9.67003 12.8723 9.99649 12.0505 9.99649C11.2287 9.99649 10.4405 9.67003 9.85943 9.08893C9.27832 8.50782 8.95186 7.71968 8.95186 6.89788ZM12.0505 11.9767C9.84522 11.9767 7.81253 12.4782 6.30708 13.3248C4.82356 14.16 3.70806 15.4242 3.70806 16.9821V17.0794C3.70711 18.1872 3.70615 19.5773 4.92558 20.5708C5.52528 21.0589 6.36524 21.4069 7.49981 21.6358C8.63628 21.8665 10.1188 21.9876 12.0505 21.9876C13.9821 21.9876 15.4637 21.8665 16.6021 21.6358C17.7367 21.4069 18.5757 21.0589 19.1763 20.5708C20.3957 19.5773 20.3938 18.1872 20.3929 17.0794V16.9821C20.3929 15.4242 19.2774 14.16 17.7948 13.3248C16.2884 12.4782 14.2567 11.9767 12.0505 11.9767ZM5.13819 16.9821C5.13819 16.1708 5.73122 15.2898 7.00784 14.5719C8.26254 13.8663 10.0435 13.4068 12.0514 13.4068C14.0574 13.4068 15.8384 13.8663 17.0931 14.5719C18.3707 15.2898 18.9628 16.1708 18.9628 16.9821C18.9628 18.2292 18.9246 18.9309 18.2725 19.461C17.9197 19.7489 17.3286 20.0302 16.318 20.2342C15.3102 20.4383 13.9325 20.5574 12.0505 20.5574C10.1684 20.5574 8.78978 20.4383 7.78297 20.2342C6.77235 20.0302 6.18123 19.7489 5.82846 19.462C5.17633 18.9309 5.13819 18.2292 5.13819 16.9821Z" fill="#0B3C70" />
                    </svg>
                    <p>Editar Perfil</p>
                </div>
            </nav>

            <div className={styles.profile}>
                <Image src={profile[0].image} width={60} height={60} alt="img" />
                <div className={styles.containerInfo}>
                    <div className={styles.personalInfo}>
                        <h2>{profile[0].nombre} {profile[0].apellido}</h2>
                        <h2>{profile[0].puesto} | {profile[0].email}</h2>
                    </div>
                </div>
            </div>

            <FormularioPerfil />
        </div>
    );
}