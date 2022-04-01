import { useRouter } from "next/router";

import { Cursus } from "types/42";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI, { useCursuses } from "lib/useAPI";

export default function CursusOverview() {
	const {
		query: { slug },
	} = useRouter();

	const { data: cursuses } = useCursuses();

	const cursus = cursuses?.find((cursus) => cursus.slug === slug);

	if (!cursuses) return <Loading />;
	return <pre>{JSON.stringify(cursus, null, 2)}</pre>;
}

CursusOverview.header = CursusHeader;
