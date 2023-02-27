import { Grid, Heading } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Event } from "types/42";
import EventCard from "ui/cards/EventCard";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusEvents() {
	const {
		query: { slug },
	} = useRouter();

	const { data: session } = useSession();

	const { data: events } = useAPI<Event[]>(`/v2/cursus/${slug}/events`);

	if (!events) return <Loading />;

	return (
		<>
			<Heading>Your campus</Heading>
			<Grid variant="cards">
				{events
					.filter((event) =>
						event.campus_ids.includes(session.user.campus)
					)
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
			<Heading>Other campuses</Heading>
			<Grid variant="cards">
				{events
					.filter(
						(event) =>
							!event.campus_ids.includes(session.user.campus)
					)
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
		</>
	);
}

CursusEvents.header = CursusHeader;
