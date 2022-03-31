import Link from "next/link";

import { Cursus } from "types/42";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function Cursuses() {
	const { data: cursuses } = useAPI<Cursus[]>(
		`/v2/cursus?sort=id&page[size]=100`
	);

	return (
		<>
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
