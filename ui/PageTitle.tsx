import Head from "next/head";

export const PAGE_TITLE_SEPARATOR = " › ";

export default function PageTitle({ title }: { title: string | string[] }) {
	if (!title || !title.length) return null;

	if (typeof title !== "string") title = title.join(PAGE_TITLE_SEPARATOR);

	return (
		<Head>
			<title>{title} :: 42extra</title>
		</Head>
	);
}
