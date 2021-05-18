import UserCard from "@/components/UserCard";
import { useSession } from "next-auth/client";
import Link from "next/link";

const links = [
	{ name: "Users", href: "/users" },
	{ name: "Campuses", href: "/campus" },
	{ name: "Cursuses", href: "/cursus" },
	{ name: "Coalitions", href: "/coalitions" },
	{ name: "Apps", href: "/apps" },
];

function Home() {
	const [session] = useSession();

	return (
		<>
			<p>Welcome {session.user?.name}!</p>
			<UserCard id={session.user.login} />
			<h2>Start surfing</h2>
			<ul className="list-disc list-inside">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href}>
							<a>{link.name}</a>
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}

export default Home;
