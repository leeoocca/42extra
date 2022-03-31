import { Alert, Button, Grid, Heading } from "theme-ui";
import { signIn, useSession } from "next-auth/react";

import { Event } from "types/42";
import EventCard from "ui/EventCard";
import useAPI from "lib/useAPI";
import isFuture from "lib/isFuture";

export default function Home() {
	const { data: session } = useSession();

	const { data: myEvents } = useAPI<Event[]>(
		`/v2/users/${session.user.id}/events?page[size]=3&filter[future]=true`
	);
	const { data: campusEvents } = useAPI<Event[]>(
		`/v2/campus/${session.user.campus}/events?page[size]=3&sort=begin_at&filter[future]=true`
	);

	const { data: slots } = useAPI<any>("/v2/me/slots?page[size]=100");

	const opts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	};

	return (
		<>
			{session.tokenExpires < Date.now() / 1000 && (
				<Alert
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<span>Stale session</span>
					<Button
						bg="transparent"
						sx={{
							textTransform: "uppercase",
							fontSize: 1,
							fontWeight: "heading",
						}}
						onClick={() => signIn("42")}
					>
						Sign back in
					</Button>
				</Alert>
			)}
			<Heading sx={{ textAlign: "center", mb: 2, fontSize: "2rem" }}>
				Welcome {session?.user ? session.user.name : "user"}!
			</Heading>
			<Heading m={3}>Your agenda</Heading>
			{myEvents && (
				<Grid variant="cards">
					{myEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Grid>
			)}
			<Heading m={3}>Campus events</Heading>
			{campusEvents && (
				<Grid variant="cards">
					{campusEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Grid>
			)}
			<Heading m={2}>Slots</Heading>
			<ul style={{ textAlign: "left" }}>
				{slots
					?.filter((slot) => isFuture(slot.begin_at))
					.map((slot) => (
						<li key={slot.id}>
							<small>
								{new Date(slot.begin_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							{" -> "}
							<small>
								{new Date(slot.end_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							{slot.scale_team && slot.scale_team}
						</li>
					))}
			</ul>
			{/* try cmd + k */}
		</>
	);
}
