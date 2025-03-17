import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <div className="text-center">
          <p className="text-xl">Welcome, {session.user.name}!</p>
          <button onClick={() => signOut()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Close Session
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => signIn("google")} className="px-4 py-2 bg-blue-500 text-white rounded">
            Login with Google
          </button>
          <button onClick={() => signIn("github")} className="mt-2 px-4 py-2 bg-gray-800 text-white rounded">
            Login with GitHub
          </button>
        </>
      )}
    </div>
  );
}
