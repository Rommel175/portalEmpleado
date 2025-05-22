import ContainerSuperior from "@/components/containers/containerSuperior/ContainerSuperior";
import { getUserData } from "@/lib/getSupabaseData";

export default async function FilesPage() {
  const { profile, fichaje, eventos } = await getUserData();

  return (
    <>
      <div style={{ display: 'none' }}>
        <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
      </div>
    </>
  );
}