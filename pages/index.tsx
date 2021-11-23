import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	return (
		<div className="text-center">
			<h2 className="mb-4 text-2xl font-bold">
				Welcome {session?.user ? session.user.name : "user"}!
			</h2>
		</div>
	);
}
