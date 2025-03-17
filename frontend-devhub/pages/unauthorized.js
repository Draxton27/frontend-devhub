import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div>
            <h1>Access Denied</h1>
            <p>You do not have permissions to view this page</p>
            <Link href="/">Go Back Home</Link>
        </div>
    )
}