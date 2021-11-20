import { useRouter } from "next/router";

import useAPI from "lib/useAPI";
import CardGrid from "ui/CardGrid";
import AppCard from "ui/AppCard";
import { getLayout } from "ui/layouts/UserLayout";
import Loading from "ui/Loading";

function UserApps() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: apps,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/apps`);

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

UserApps.getLayout = getLayout;

export default UserApps;
