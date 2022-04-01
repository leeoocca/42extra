import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	Link as ThemeLink,
	Spinner,
} from "theme-ui";
import { CalendarOptions, GoogleCalendar, ICalendar } from "datebook";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

import { Event, EventUser } from "types/42";
import fetcher from "lib/fetcher";
import getPrettyDuration from "lib/getPrettyDuration";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import isFuture from "lib/isFuture";

const CalendarButton = (props) => (
	<Button sx={{ width: "100%" }} bg={"muted"} {...props} />
);

export default function EventDetails() {
	const { data: session } = useSession();

	const {
		query: { id },
	} = useRouter();

	const [loading, setLoading] = useState<boolean | null>(true); // null = error
	const [status, setStatus] = useState<boolean | null>(null);

	const {
		data: event,
		isLoading,
		isError,
	} = useAPI<Event>(`/v2/events/${id}`);

	const { data: eventUser } = useAPI<EventUser[]>(
		`/v2/events_users?filter[event_id]=${id}&filter[user_id]=${session.user.id}`
	);

	useEffect(() => {
		if (eventUser) {
			setStatus(!!eventUser.length);
			setLoading(false);
		}
	}, [eventUser]);

	function subscribe() {
		fetcher(
			`/api/v2/events_users?events_user[event_id]=${id}&events_user[user_id]=${session.user.id}`,
			"POST"
		).then((res) => {
			if (res.status === 201) {
				setStatus(true);
			} else {
				throw Error();
			}
		});
	}

	function unsubscribe() {
		fetcher(`/api/v2/events_users/${eventUser[0].id}`, "DELETE")
			.then((res) => {
				if (res.status === 204) {
					setStatus(false);
				} else {
					throw Error();
				}
			})
			.catch();
	}

	function handleSubscription() {
		setLoading(true);

		try {
			if (status) {
				unsubscribe();
			} else {
				subscribe();
			}
		} catch (Error) {
			setLoading(null);
			return;
		}
		setLoading(false);
	}

	if (isLoading) return <Loading />;
	if (isError) return <>Error</>;

	const isDisabled = loading || !isFuture(event.begin_at);

	const config: CalendarOptions = {
		title: event.name,
		location: event.location,
		description: event.description,
		start: new Date(event.begin_at),
		end: new Date(event.end_at),
	};

	const icalendar = new ICalendar(config);
	const googleCalendar = new GoogleCalendar(config);

	return (
		<Flex
			as="article"
			sx={{
				flexDirection: "column",
				width: ["100%", , "50%"],
				mx: "auto",
				"& > *": { my: 2 },
			}}
		>
			<pre>{event.kind}</pre>
			<Heading as="h1" mb={1}>
				{event.name}
			</Heading>
			<Box>{event.location}</Box>
			<Flex sx={{ flexDirection: "column" }}>
				<time>
					{getTimeAgo(event.begin_at)} for{" "}
					{getPrettyDuration(event.begin_at, event.end_at)}
				</time>
				<time></time>
				<time>{event.begin_at}</time>
				<time>{event.end_at}</time>
			</Flex>
			<Box>
				<Button
					onClick={() => handleSubscription()}
					mr={2}
					disabled={isDisabled}
					sx={{
						bg: isDisabled ? "gray" : loading === null ? "red" : "",
					}}
				>
					{loading && (
						<Spinner
							sx={{
								color: "white",
								display: "inline",
								mr: 1,
							}}
							size={20}
						/>
					)}
					{status ? "Unsubscribe" : "Subscribe"}
				</Button>
				{event.nbr_subscribers}{" "}
				{event.max_people && <>/ {event.max_people}</>}
			</Box>
			<Box sx={{}}>
				<ReactMarkdown
					components={{
						a: ({ ...props }) => <ThemeLink {...props} />,
					}}
				>
					{event.description}
				</ReactMarkdown>
			</Box>
			<Grid columns={2}>
				<CalendarButton onClick={() => icalendar.download()}>
					Download .ics
				</CalendarButton>
				<CalendarButton
					as="a"
					href={googleCalendar.render()}
					target="_blank"
					rel="noopener noreferrer"
				>
					Add to Google Calendar
				</CalendarButton>
			</Grid>
			<Grid columns={2} mt={3}>
				<Box>
					<Heading>Campuses</Heading>
					<ul>
						{event.campus_ids.map((campus) => (
							<Link key={campus} href={`/campus/${campus}`}>
								<a>
									<li>{campus}</li>
								</a>
							</Link>
						))}
					</ul>
				</Box>
				<Box>
					<Heading>Cursuses</Heading>
					<ul>
						{event.cursus_ids.map((cursus) => (
							<Link key={cursus} href={`/cursus/${cursus}`}>
								<a>
									<li>{cursus}</li>
								</a>
							</Link>
						))}
					</ul>
				</Box>
			</Grid>
		</Flex>
	);
}
