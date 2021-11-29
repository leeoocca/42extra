import Link from "next/link";
import { useRouter } from "next/router";

import prettyMilliseconds from "pretty-ms";

import { User } from "types/User";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";
// import getCampusFromId from "lib/getCampusFromId";

function getCurrentLocation(locations: any): string {
	if (locations)
		// in ${getCampusFromId(locations[0].campus_id).name}
		return `${locations[0].host} for ~
		${prettyMilliseconds(Date.now() - Date.parse(locations[0].begin_at), {
			unitCount: 2,
		})}`;
	return null;
}

function getLastSeen(locations: any): string {
	if (locations) {
		if (locations.length)
			// in ${getCampusFromId(locations[0].campus_id).name}
			return `last seen ${getTimeAgo(locations[0].end_at)}`;
		else return "never seen on any campus";
	}
	return "...";
}

const Th = ({ children }) => (
	<th className="py-1 pr-2 text-xs text-left uppercase opacity-75">
		{children}
	</th>
);

const None = () => <i className="opacity-75">none</i>;

export default function UserOverview() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isError }: { data: User; isError: any } = useAPI(
		`/v2/users/${login}`
	);
	const { data: coalition } = useAPI(`/v2/users/${login}/coalitions`);
	const { data: locations } = useAPI(`/v2/users/${login}/locations`);

	if (isError) return <>Error</>;
	if (!user) return <Loading />;

	const details = [
		{ name: "Email", value: user.email, href: `mailto:${user.email}` },
		{
			name: "Correction points",
			value: user.correction_point,
			href: `/users/${login}/scales`,
		},
		{ name: "Wallet", value: `${user.wallet} ₳`, href: null },
		{
			name: "Pool",
			value: user.pool_year
				? `${user.pool_month} ${user.pool_year}`
				: "none",
			href: null,
		},
		{
			name: "Location",
			value: user.location
				? getCurrentLocation(locations) || user.location
				: getLastSeen(locations),
			href: `/users/${login}/locations`,
		},
		{
			name: "Achievements",
			value: user.achievements.length,
			href: `/users/${login}/achievements`,
		},
	];

	return (
		<>
			<table>
				<tbody>
					{details.map((detail) => (
						<tr key={detail.name}>
							<Th>{detail.name}</Th>
							<td>
								{detail.href ? (
									<Link href={detail.href}>
										<a>{detail.value}</a>
									</Link>
								) : detail.value === "none" ? (
									<None />
								) : (
									detail.value
								)}
							</td>
						</tr>
					))}
					<tr>
						<Th>Coalition{coalition?.length > 1 && "s"}</Th>
						<td>
							{coalition ? (
								coalition.length ? (
									<ul>
										{coalition.map((coalition) => (
											<li key={coalition.slug}>
												<Link
													href={`/coalitions/${coalition.slug}`}
												>
													<a>{coalition.name}</a>
												</Link>
											</li>
										))}
									</ul>
								) : (
									<None />
								)
							) : (
								"..."
							)}
						</td>
					</tr>
					<tr>
						<Th>Campus{user.campus?.length > 1 && "es"}</Th>
						<td>
							{user.campus?.length ? (
								<ul>
									{user.campus.map((campus) => (
										<li key={campus.id}>
											<Link href={`/campus/${campus.id}`}>
												<a>{campus.name}</a>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<None />
							)}
						</td>
					</tr>
					<tr>
						<Th>Cursus{user.cursus_users?.length > 1 && "es"}</Th>
						<td>
							{user.cursus_users?.length ? (
								<ul>
									{user.cursus_users.map((cursus) => (
										<li key={cursus.cursus.id}>
											<Link
												href={`/cursus/${cursus.cursus.id}`}
											>
												<a>
													{cursus.cursus.name} -{" "}
													{cursus.level}
												</a>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<None />
							)}
						</td>
					</tr>
				</tbody>
			</table>
			<code className="block">
				languages: {user.languages_users.length}
			</code>
			<code className="block">anonymize date: {user.anonymize_date}</code>
		</>
	);
}

UserOverview.header = UserHeader;
