import Head from "next/head";

export default function PageTitle({ children }: { children: string }) {
	return (
		<Head>
			<title>{children} - 42extra</title>
		</Head>
	);
}
