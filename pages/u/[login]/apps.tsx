import { useRouter } from "next/router";
import useAPI from "lib/useAPI";
import Link from "next/link";
import { getLayout } from "components/layouts/UserLayout";
import { EyeOffIcon } from "@heroicons/react/outline";
import CardGrid from "components/CardGrid";
import Card from "components/Card";
import { useSession } from "next-auth/client";
import Image from "next/image";
import AppCard from "components/AppCard";

function UserApps() {
	const router = useRouter();
	const { login } = router.query;
	const [session] = useSession();

	const {
		data: apps,
		isLoading,
		isError,
	} = useAPI(`/v2/users/${login}/apps`);

	if (isLoading) return <>Loading...</>;
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
