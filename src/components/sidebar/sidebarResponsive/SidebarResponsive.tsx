import SidebarItemsResponsive from './SidebarItemsResponsive';
import styles from './sidebarResponsive.module.css'

export default function SidebarResponsive({ is_admin }: { is_admin: boolean }) {
  return (
    <div className={styles.container}>
      <SidebarItemsResponsive  is_admin={is_admin} />
    </div>
  );
}