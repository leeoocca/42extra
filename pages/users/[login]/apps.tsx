import { useRouter } from "next/router";

import { App } from "types/42";
import AppCard from "ui/AppCard";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

export default function UserApps() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: apps,
		isLoading,
		isError,
	} = useAPI<App[]>(`/v2/users/${login}/apps`);

	if (isLoading) return <Loading />;
	if (isError) return <>Error</>;

	if (!apps.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<p>
					No apps from <span className="font-bold">{login}</span> yet.
				</p>
			</div>
		);

	return (
		<CardGrid>
			{apps.map((app) => (
				<AppCard key={app.id} app={app} />
			))}
		</CardGrid>
	);
}

UserApps.header = UserHeader;
