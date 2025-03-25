'use client'

import { createClient } from '@/utils/supabase/client';
import styles from './ButtonLogin.module.css'
import { FaGoogle } from "react-icons/fa";

export default function ButtonLoginComponent( props : { nextUrl?: string } ) {

  const supabase = createClient();

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${props.nextUrl || ""}`
      }
    })
  }

  return (
    <button className={styles.button} onClick={handleLogin}> <FaGoogle /> Inicia sesión</button>
  );
}