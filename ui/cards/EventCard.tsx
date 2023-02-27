import { Card, Text } from "@theme-ui/components";
import { formatDateTime } from "lib/dateTime";
import Link from "next/link";
import { Event } from "types/42";

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
				<p>{formatDateTime(event.begin_at)}</p>
			</Card>
		</Link>
	);
}
