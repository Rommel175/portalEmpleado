import SidebarComponent from '@/components/sidebar/SidebarComponent';
import styles from './layout.module.css';
import { Poppins } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const poppins = Poppins({
  weight: ['700', '600', '500', '400'],
  subsets: ['latin']
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    console.log('Error fetching profiles: ', errorProfile);
  }

  const profile = dataProfile && dataProfile.length > 0 ? dataProfile[0] : [];

  return (
    <div className={`${styles.wraper} ${poppins.className}`}>
      <SidebarComponent is_admin={profile?.is_admin} />
      <div className={styles.container}>
        {children}
      </div>

    </div>
  );
}
