import { signIn, useSession } from "next-auth/react";
import { Alert, Button } from "@theme-ui/components";

// import useAPI from "lib/useAPI";

export default function Home() {
	const { data: session } = useSession();
	// const { data } = useAPI("/v2/me/slots?page[size]=100");

	// const opts: Intl.DateTimeFormatOptions = {
	// 	year: "numeric",
	// 	month: "2-digit",
	// 	day: "2-digit",
	// 	hour: "numeric",
	// 	minute: "numeric",
	// 	hour12: false,
	// };

	return (
		<div className="text-center">
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
			<h2 className="mb-4 text-2xl font-bold">
				Welcome {session?.user ? session.user.name : "user"}!
			</h2>
			<ul style={{ textAlign: "left" }}>
				{/* {data
					?.filter(
						(slot) => new Date(slot.begin_at).valueOf() > Date.now()
					)
					.map((slot) => (
						<li>
							<small>
								{new Date(slot.begin_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							<small>
								{new Date(slot.end_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							{slot.scale_team && slot.scale_team}
						</li>
					))} */}
			</ul>
			{/* try cmd + k */}
		</div>
	);
}
