import { redirect } from "next/navigation";

export default function HomePage() {
  
  redirect('/dashboard/inicio'); //Luego implementarlo en el middleware
  
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
