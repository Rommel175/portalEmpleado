import Navbar from '@/components/navbar/Navbar';
import styles from './perfil.module.css'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect('/login')
  }

  return (
    <div className={styles.wraper}>
      <Navbar user={user}/>
      
    </div>
  );
}