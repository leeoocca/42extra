import { useRouter } from "next/router";
import useAPI from "lib/useAPI";
import { getLayout } from "ui/layouts/UserLayout";
import { EyeOffIcon } from "@heroicons/react/outline";
import CardGrid from "ui/CardGrid";
import { useSession } from "next-auth/client";
import AppCard from "ui/AppCard";
import { Grid, Spinner } from "@theme-ui/components";

function UserApps() {
	const router = useRouter();
	const { login } = router.query;
	const [session] = useSession();

	const {
		data: apps,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/apps`);

	if (isLoading)
		return (
			<Grid sx={{ placeItems: "center" }}>
				<Spinner />
			</Grid>
		);
	if (isError) return <>Error</>;

	if (!apps.length)
		return (
			<div className="flex flex-col items-center w-full mt-4">
				<EyeOffIcon className="w-32 h-32 mb-2" />
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
