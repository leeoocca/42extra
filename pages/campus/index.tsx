import Link from "next/link";

import { Card, Grid } from "@theme-ui/components";
import { useSession } from "next-auth/react";

import { Campus } from "types/42";
import Loading from "ui/Loading";
import getPrettyCountry from "lib/getPrettyCountry";

function CampusesIndex() {
	const session = useSession();
	const { data: campuses } = useAPI<Campus[]>(
		`/v2/campus?sort=id&page[size]=100`
	);

	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Campuses</h1>
			<Grid variant="cards">
				{!campuses ? (
					<Loading />
				) : (
					campuses.map((c) => (
						<Link key={c.id} href={`/campus/${c.id}`} passHref>
							<Card
								as="a"
								bg={
									c.id === session.data.user.campus
										? "highlight"
										: "muted"
								}
								p="2"
								sx={{ height: "8rem" }}
							>
								<div>
									<h2>{c.name}</h2>
									<p className="text-xs">
										{c.city}, {getPrettyCountry(c.country)}
									</p>
									<p className="text-xs">
										{c.users_count} users
									</p>
									<p className="text-xs">{c.language.name}</p>
								</div>
							</Card>
						</Link>
					))
				)}
			</Grid>
		</>
	);
}

export default CampusesIndex;
