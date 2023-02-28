import { Heading, Text } from "@theme-ui/components";
import { formatTime } from "lib/dateTime";
import getPrettyCountry from "lib/getPrettyCountry";
import { useCampuses } from "lib/useAPI";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CampusHeader from "ui/headers/CampusHeader";
import Link from "ui/Link";
import Loading from "ui/Loading";
import WebsiteLink from "ui/WebsiteLink";

export default function CampusIndex() {
	const {
		query: { id },
	} = useRouter();

	const { data: campuses } = useCampuses();

	const [time, setTime] = useState(new Date());

	function refreshClock() {
		setTime(new Date());
	}

	useEffect(() => {
		const offset = 60000 - (time.valueOf() % 60000);
		const timerId = setTimeout(() => {
			refreshClock();
			setInterval(refreshClock, 60000);
		}, offset);
		return () => clearInterval(timerId);
	}, []);

	if (!campuses) return <Loading />;

	const c = campuses.find((campus) => String(campus.id) === String(id));

	return (
		<>
			<WebsiteLink url={c.website} />
			<Heading my={2}>
				Users <Link href={`/campus/${id}/users`}>{c.users_count}</Link>
			</Heading>
			<Heading my={2}>Local time</Heading>
			<time dateTime={time.toISOString()}>
				{formatTime(time, { timeZone: c.time_zone })}
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
