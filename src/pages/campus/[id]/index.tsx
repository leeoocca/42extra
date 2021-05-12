import Card from "@/components/Card";
import useAPI from "@/lib/useAPI";
import Link from "next/link";
import { useRouter } from "next/router";

function CampusIndex() {
	const router = useRouter();
	const { id } = router.query;

	const { data: c } = useAPI(`/v2/campus/${id}`);
	return (
		<>
			{c && (
				<>
					<h1 className="text-3xl font-bold leading-relaxed">
						{c.name}
					</h1>
					<p>
						{c.city}, {c.country}
					</p>
					<p>
						<a
							href={c.website}
							target="_blank"
							rel="noopener noreferrer"
						>
							{c.website}
						</a>
					</p>
					<Link href={`/campus/${id}/users`}>
						<a>
							<p>{c.users_count} users</p>
						</a>
					</Link>
					<p>
						Main language: {c.language.name}{" "}
						<img
							src={`https://www.countryflags.io/${
								c.language.identifier === "en"
									? "gb"
									: c.language.identifier
							}/flat/24.png`}
						/>
					</p>
					<p>{c.active ? "active" : "inactive"}</p>
					<h2>Socials</h2>
					<ul>
						{c.facebook && (
							<li>
								<a
									href={c.facebook}
									target="_blank"
									rel="noopener noreferrer"
								>
									Facebook
								</a>
							</li>
						)}
						{c.twitter && (
							<li>
								<a
									href={c.twitter}
									target="_blank"
									rel="noopener noreferrer"
								>
									Twitter
								</a>
							</li>
						)}
					</ul>
					<h2>Full address</h2>
					<p>{c.address}</p>
					<p>
						{c.zip} {c.city}, {c.country}
					</p>
				</>
			)}
		</>
	);
}

export default CampusIndex;