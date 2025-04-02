'use client'

import styles from './inicio.module.css';
import ContainerDatos from '@/components/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/containers/fichaje/ContainerFichaje';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function HomePage() {

  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        redirect('/login')
      }
      setUser(data.user)
    }

    loadUser()
  }, [])

  return (
    <>
      <div className={styles.containerSuperior}>
        {user && <ContainerDatos user={user} />}

        <ContainerFichaje />
      </div>

      <ContainerEquipo />

    </>
  );
}