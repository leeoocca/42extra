import { getAppLink } from "lib/intraLink";
import useAPI from "lib/useAPI";
import Image from "next/image";
import { useRouter } from "next/router";
import { App } from "types/42";
import UserCard from "ui/cards/UserCard";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import WebsiteLink from "ui/WebsiteLink";

export default function AppDetails() {
	const {
		query: { id },
	} = useRouter();

	const { data: app } = useAPI<App>(`/v2/apps/${id}`);

	if (!app) return <Loading />;

	return (
		<>
			<PageTitle title={`${app.name} by ${app.owner.login}`} />
			<div className="flex items-center space-x-4">
				{app.image && (
					<div className="grid w-24 h-w-24 place-items-center">
						<Image
							height={96}
							width={96}
							src={
								"https://cdn.intra.42.fr" + app.image.substr(8)
							}
							className="object-contain"
							alt={app.name}
						/>
					</div>
				)}
				<div>
					<h1 className="text-5xl font-bold">{app.name}</h1>
					<p>{app.description}</p>
				</div>
			</div>
			<WebsiteLink url={app.website} />
			<p>{app.public ? "public" : "not public"}</p>
			<p>Created: {app.created_at}</p>
			<p>Updated: {app.updated_at}</p>
			<p>Rate limit: {app.rate_limit}</p>
			<h2>Created by</h2>
			<UserCard id={app.owner.login} />
			<h2 className="text-3xl font-bold leading-relaxed">Roles</h2>
			<ul>
				{app.roles.map((role) => (
					<li key={role.id} className="flex space-x-2">
						<span className="font-semibold">{role.name}</span>
						<span>{role.description}</span>
					</li>
				))}
			</ul>
			<h2 className="text-3xl font-bold leading-relaxed">Scopes</h2>
			<ul>
				{app.scopes.map((scopes) => (
					<li key={scopes} className="flex space-x-2">
						{scopes}
					</li>
				))}
			</ul>
		</>
	);
}

AppDetails.getIntraLink = getAppLink;
