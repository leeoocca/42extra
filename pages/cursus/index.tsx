import { useCursuses } from "lib/useAPI";
import Link from "next/link";
import { Card } from "theme-ui";
import CardGrid from "ui/grids/CardGrid";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";

export default function Cursuses() {
	const { data: cursuses } = useCursuses();

	return (
		<>
			<PageTitle title="Cursuses" />
			<h1 className="text-3xl font-bold leading-relaxed">Cursuses</h1>
			<CardGrid>
				{cursuses ? (
					cursuses.map((cursus) => (
						<Link
							key={cursus.id}
							href={`/cursus/${cursus.slug}`}
							passHref
						>
							<Card bg="muted" px={3} py={2}>
								<div>
									<h2>{cursus.name}</h2>
									<p className="text-xs">#{cursus.id}</p>
								</div>
							</Card>
						</Link>
					))
				) : (
					<Loading />
				)}
			</CardGrid>
		</>
	);
}
