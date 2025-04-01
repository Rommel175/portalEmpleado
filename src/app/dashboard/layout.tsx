import SidebarComponent from '@/components/sidebar/SidebarComponent';
import styles from './layout.module.css';
import { Roboto } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';

const roboto = Roboto({
  weight: ['600', '400', '500'],
  subsets: ['latin']
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    redirect('/login')
  }

  return (
    <div className={`${styles.wraper} ${roboto.className}`}>
      <SidebarComponent />
      <div className={styles.container}>
        <Navbar user={user}/>
        {children}
      </div>
      
    </div>
  );
}
