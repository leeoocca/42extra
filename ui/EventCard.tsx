import Link from "next/link";

import { Card, Text } from "theme-ui";

import { Event } from "types/42";
import { locale } from "lib/constants";

export default function EventCard({ event }: { event: Event }) {
	return (
		<Link href={`/events/${event.id}`} passHref>
			<Card bg="muted" px={3} py={2} as="a">
				<b>{event.name}</b>
				<Text as="p" variant="mono">
					{event.kind}
				</Text>
				<p>
					{event.nbr_subscribers}
					{event.max_people && ` / ${event.max_people}`}
				</p>
				<p>{event.location}</p>
				<p>{new Date(event.begin_at).toLocaleString(locale)}</p>
			</Card>
		</Link>
	);
}
