import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import Card from "./Card";

function AppCard({ app }) {
	const { data: session } = useSWR("/api/auth/session");

	return (
		<Link key={app.id} href={`/apps/${app.id}`}>
			<a>
				<Card className="h-20 overflow-hidden">
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
						<h2 className="text-base font-semibold">{app.name}</h2>
						<p>{app.description}</p>
						{app.owner.login === session?.user.login && (
							<p>{app.public ? "public" : "hidden"}</p>
						)}
					</div>
				</Card>
			</a>
		</Link>
	);
}

export default AppCard;
