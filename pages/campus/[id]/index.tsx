import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { Heading, Text, Link as TLink } from "@theme-ui/components";

import { locale } from "lib/constants";
import { useCampuses } from "lib/useAPI";
import CampusHeader from "ui/headers/CampusHeader";
import Loading from "ui/Loading";
import WebsiteLink from "ui/WebsiteLink";
import getPrettyCountry from "lib/getPrettyCountry";

export default function CampusIndex() {
	const router = useRouter();
	const { id } = router.query;

	const { data: campuses } = useCampuses();

	const [time, setTime] = useState(new Date());

	function refreshClock() {
		setTime(new Date());
	}

	useEffect(() => {
		const timerId = setInterval(refreshClock, 1000);
		return function cleanup() {
			clearInterval(timerId);
		};
	}, []);

	if (!campuses) return <Loading />;

	const c = campuses.find((campus) => campus.id === parseInt(String(id)));

	return (
		<>
			<WebsiteLink url={c.website} />
			<Heading my={2}>
				Users{" "}
				<Link href={`/campus/${id}/users`} passHref>
					<TLink>
						<p>{c.users_count}</p>
					</TLink>
				</Link>
			</Heading>
			<Heading my={2}>Local time</Heading>
			<time dateTime={time.toISOString()}>
				{time.toLocaleTimeString(locale, { timeZone: c.time_zone })}
			</time>
			<Heading my={2}>Main language</Heading>
			<p>{c.language.name}</p>
			<Heading my={2}>Status</Heading>
			<Text color={c.active ? "lime" : "red"}>
				{c.active ? "active" : "inactive"}
			</Text>
			{c.facebook || c.twitter ? (
				<>
					<Heading>Socials</Heading>
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
				</>
			) : null}
			<Heading my={2}>Address</Heading>
			<address>
				{c.address}
				<br />
				{c.zip} {c.city}, {getPrettyCountry(c.country)}
			</address>
		</>
	);
}

CampusIndex.header = CampusHeader;
