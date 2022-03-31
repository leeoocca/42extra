import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
	Box,
	Button,
	Flex,
	Heading,
	Link as ThemeLink,
	Paragraph,
	Spinner,
} from "theme-ui";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

import { Event, EventUser } from "types/42";
import fetcher from "lib/fetcher";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import prettyMilliseconds from "pretty-ms";

export default function EventDetails() {
	const { data: session } = useSession();

	const router = useRouter();
	const { id } = router.query;

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

	const isPast = new Date(event.begin_at).valueOf() < Date.now();
	const isDisabled = loading || isPast;

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
					{prettyMilliseconds(
						new Date(event.end_at).valueOf() -
							new Date(event.begin_at).valueOf()
					)}
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
			<Box>
				<Heading>Campuses</Heading>
				<ul>
					{event.campus_ids.map((campus) => (
						<Link key={campus} href={`/campus/${campus}`}>
							<li>{campus}</li>
						</Link>
					))}
				</ul>
			</Box>
			<Box>
				<Heading>Cursuses</Heading>
				<ul>
					{event.cursus_ids.map((cursus) => (
						<Link key={cursus} href={`/cursus/${cursus}`}>
							<li>{cursus}</li>
						</Link>
					))}
				</ul>
			</Box>
		</Flex>
	);
}
