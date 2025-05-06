import ContainerSuperior from "@/components/containers/containerSuperior/ContainerSuperior";
import Navbar from "@/components/navbar/Navbar";
import { getUserData } from "@/lib/getSupabaseData";

export default async function FilesPage() {
  const { profile, fichaje, eventos } = await getUserData();

  return (
    <>
      <Navbar image={profile.image} title="Archivos" />

      <div style={{ display: 'none' }}>
        <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
      </div>
      
    </>
  );
}