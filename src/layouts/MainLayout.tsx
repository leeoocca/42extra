import { useSession, signIn } from "next-auth/client";
import StatusBar from "@/components/StatusBar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Head from "next/head";

interface Props {
	children: React.ReactNode;
}

function MainLayout({ children }: Props) {
	const [session, loading] = useSession();

	var content = (
		<div className="flex flex-col min-h-screen antialiased bg-background text-foreground">
			<StatusBar />
			{children}
			<Footer />
		</div>
	);

	if (!loading && !session?.user) signIn("42");

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			</Head>
			{loading ? <Loader /> : content}
		</>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);

export default MainLayout;
