import { useCursuses } from "lib/useAPI";
import Link from "next/link";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
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
						<Link key={cursus.id} href={`/cursus/${cursus.slug}`}>
							<a>
								<Card className="h-32 overflow-hidden">
									<div>
										<h2>{cursus.name}</h2>
										<p className="text-xs">#{cursus.id}</p>
									</div>
								</Card>
							</a>
						</Link>
					))
				) : (
					<Loading />
				)}
			</CardGrid>
		</>
	);
}
