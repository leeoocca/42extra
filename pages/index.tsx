import { useSession } from "next-auth/client";

export default function Home() {
	const [session] = useSession();

	return (
		<div className="text-center">
			<h2 className="mb-4 text-2xl font-bold">
				Welcome {session?.user ? session.user.name : "user"}!
			</h2>
		</div>
	);
}
