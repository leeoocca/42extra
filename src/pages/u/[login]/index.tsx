import { useRouter } from "next/router";
import { getLayout } from "@/components/layouts/UserLayout";
import useAPI from "@/lib/useAPI";
import Link from "next/link";

const Th = ({ children }) => (
	<th className="py-1 pr-2 text-xs text-left uppercase opacity-75">
		{children}
	</th>
);

function UserOverview() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);
	const { data: coalition } = useAPI(`/v2/users/${login}/coalitions`);

	if (isError || !user) {
		return <>error</>;
	}
	if (isLoading) return <>loading...</>;

	const details = [
		{ name: "Email", value: user.email, href: `mailto:${user.email}` },
		{
			name: "Phone",
			value: user.phone,
			href: +user.phone > 0 ? `tel:${user.phone}` : null,
		},
		{
			name: "Correction points",
			value: user.correction_point,
			href: `/u/${login}/scales`,
		},
		{ name: "Wallet", value: `${user.wallet} ₳`, href: null },
		{
			name: "Pool",
			value: `${user.pool_month} ${user.pool_year}`,
			href: null,
		},
		{
			name: "Location",
			value: user.location || "unavailible",
			href: `/u/${login}/locations`,
		},
		{
			name: "Achievements",
			value: user.achievements.length,
			href: `/u/${login}/achievements`,
		},
		// {name: , value: , href: },
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
								"none"
							)}
						</td>
					</tr>
					<tr>
						<Th>Campus{user.campus?.length > 1 && "es"}</Th>
						<td>
							<ul>
								{user.campus.map((campus) => (
									<li key={campus.id}>
										<Link href={`/campus/${campus.id}`}>
											<a>{campus.name}</a>
										</Link>
									</li>
								))}
							</ul>
						</td>
					</tr>
					<tr>
						<Th>Cursus{user.campus?.length > 1 && "es"}</Th>
						<td>
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

UserOverview.getLayout = getLayout;

export default UserOverview;
