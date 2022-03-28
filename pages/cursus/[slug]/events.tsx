import { useRouter } from "next/router";

import { Heading, Grid } from "@theme-ui/components";
import { useSession } from "next-auth/react";

import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import EventCard from "ui/EventCard";

export default function CursusEvents() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: session } = useSession();

	const { data: events } = useAPI(`/v2/cursus/${slug}/events`);

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
