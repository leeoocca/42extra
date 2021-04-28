import { getLayout as getMainLayout } from "@/components/layouts/MainLayout";
import Head from "next/head";

function SimpleLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Head>
				<title>42next</title>
			</Head>
			<main className="flex-grow w-full px-4 py-6 mx-auto max-w-7xl">
				{children}
			</main>
		</>
	);
}
export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<SimpleLayout>{page}</SimpleLayout>);

export default SimpleLayout;
