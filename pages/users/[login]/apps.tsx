import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { App } from "types/42";
import AppCard from "ui/cards/AppCard";
import CardGrid from "ui/grids/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

export default function UserApps() {
	const {
		query: { login },
	} = useRouter();

	const {
		data: apps,
		isLoading,
		error,
	} = useAPI<App[]>(`/v2/users/${login}/apps`);

	if (isLoading) return <Loading />;
	if (error) return <>Error</>;

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
