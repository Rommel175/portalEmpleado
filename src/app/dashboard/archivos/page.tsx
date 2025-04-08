import ContainerSuperior from "@/components/containers/containerSuperior/ContainerSuperior";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function FilesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    redirect('/login')
  }

  const user = data.user;

  return (
    <>
      <div>
        <h1>Files page</h1>
      </div>

      <div style={{display: 'none'}}>
        <ContainerSuperior user={user}/>
      </div>
    </>
  );
}