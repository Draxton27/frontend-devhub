import LoginButton from "../components/LoginButton";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import AuthPage from "./auth";
export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Welcome to DevHub</h1>
      <AuthPage></AuthPage>
      {/* {session ? (
      <>
        <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign Out</button>
      </>
      ) : (
        <Link href="/api/auth/signin">Sign In</Link>
      )} */}
    </div>
  );
}
