import { useRouter } from "next/router";

import { Grid, Heading } from "theme-ui";

import { Event } from "types/42";
import CampusHeader from "ui/headers/CampusHeader";
import EventCard from "ui/EventCard";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import isFuture from "lib/isFuture";

export default function CampusUsers() {
	const router = useRouter();
	const { id } = router.query;

	const { data: events, isLoading } = useAPI<Event[]>(
		`/v2/campus/${id}/events`
	); // TODO sort by closest

	if (isLoading) return <Loading />;

	return (
		<>
			<Heading>Future</Heading>
			<Grid variant="cards">
				{events
					.filter((event) => isFuture(event.end_at))
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
			<Heading>Past</Heading>
			<Grid variant="cards">
				{events
					.filter((event) => isFuture(event.end_at))
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
		</>
	);
}

CampusUsers.header = CampusHeader;
