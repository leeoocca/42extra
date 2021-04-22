import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Nav from "@components/Nav";
import Footer from "@components/Footer";

export default function Layout({ children }) {
	const router = useRouter();
	const [session, loading] = useSession();

	if (loading)
		return (
			<div className="bg-black text-white grid min-h-screen w-screen place-items-center">
				<code>Loading...</code>
			</div>
		);

	if (session)
		return (
			<div className="antialiased font-sans bg-gray-100 min-h-screen flex flex-col">
				<Nav />
				<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow">
					<div className="px-4 py-6 sm:px-0">{children}</div>
				</main>
				<Footer />
			</div>
		);

	router.push("/api/auth/signin");
}
