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
		<div className="text-center">
			<h2 className="mb-4 text-2xl font-bold">
				Welcome {session?.user ? session.user.name : "user"}!
			</h2>
			<ul>
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href}>
							<a className="mb-2 hover:underline">{link.name}</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Home;
