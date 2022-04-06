import { useRouter } from "next/router";

import { useCursuses } from "lib/useAPI";
import CursusHeader, { findCursus } from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusOverview() {
	const {
		query: { slug },
	} = useRouter();

	const { data: cursuses } = useCursuses();

	const cursus = cursuses?.find(findCursus(String(slug)));

	if (!cursuses) return <Loading />;
	return <pre>{JSON.stringify(cursus, null, 2)}</pre>;
}

CursusOverview.header = CursusHeader;
