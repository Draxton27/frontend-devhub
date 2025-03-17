import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import Link from "next/link";


export async function getServerSideProps(context) {
    const session = await getSession(context);
    if(!session){
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }

    return {
        props: {session}
    };
}

export default function Dashboard({ session }) {
    return (
      <div>
        <h1>Welcome to Your Dashboard</h1>
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <Image src={session.user.image} alt="Profile Picture" width={50} height={50} />
        <Link href="/api/auth/signout">Sign Out</Link>
      </div>
    );
  }