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
          <button onClick={() => signOut()}>Sign Out</button>
      </>
      ) : (
        <a href="/api/auth/signin">Sign In</a>
      )}
    </div>
  );
}
