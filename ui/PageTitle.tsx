import Head from "next/head";

export default function PageTitle({ title }: { title: string }) {
	return (
		<Head>
			<title>{title} - 42extra</title>
		</Head>
	);
}
