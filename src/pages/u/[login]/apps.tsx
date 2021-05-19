import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import Link from "next/link";
import { getLayout } from "@/layouts/UserLayout";
import { EyeOffIcon } from "@heroicons/react/outline";
import CardGrid from "@/components/CardGrid";
import Card from "@/components/Card";
import { useSession } from "next-auth/client";
import Image from "next/image";

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
				<Card key={app.id}>
					<Link href={`/apps/${app.id}`}>
						<a className="flex">
							{app.image && app.image.length && (
								<div className="relative w-16 h-16 mr-2">
									<Image
										src={
											"https://cdn.intra.42.fr" +
											app.image.replace("/uploads", "")
										}
										layout="fill"
										objectFit="contain"
									/>
								</div>
							)}

							<div className="text-sm">
								<h2 className="text-base font-semibold">
									{app.name}
								</h2>
								<p>{app.description}</p>
								{login === session.user.login && (
									<p>{app.public ? "public" : "hidden"}</p>
								)}
							</div>
						</a>
					</Link>
				</Card>
			))}
		</CardGrid>
	);
}

UserApps.getLayout = getLayout;

export default UserApps;
