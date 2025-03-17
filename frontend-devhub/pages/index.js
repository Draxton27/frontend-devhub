import LoginButton from "../components/LoginButton";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Welcome to DevHub</h1>
      
      {session ? (
      <>
        <p>Welcome, {session.user.name}</p>
        <p>Your role: {session.user.role}</p>

        {/* Show admin panel link only for admins */}
        {session.user.role === "admin" && (
            <a href="/admin">Go to Admin Panel</a>
          )}

          <button onClick={() => signOut()}>Sign Out</button>
      </>
      ) : (
        <a href="/api/auth/signin">Sign In</a>
      )}
    </div>
  );
}
