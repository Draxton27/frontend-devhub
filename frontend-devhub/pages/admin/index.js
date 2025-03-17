import { useSession } from "next-auth/react";

export default function AdminPage() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "admin") {
    return <h1>Access Denied</h1>;
  }

  return (
    <div>
      <h1>Welcome Admin</h1>
      <p>Only users with admin role can see this page.</p>
    </div>
  );
}
