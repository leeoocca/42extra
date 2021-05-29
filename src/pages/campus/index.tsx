import Card from "@/components/Card";
import CardGrid from "@/components/CardGrid";
import useAPI from "@/lib/useAPI";
import Link from "next/link";

function CampusesIndex() {
	const { data: campuses, isLoading } = useAPI(
		`/v2/campus?sort=id&page[size]=100`
	);

	if (isLoading) return <>Loading...</>;

	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Campuses</h1>
			<CardGrid>
				{campuses &&
					campuses.map((c) => (
						<Link href={`/campus/${c.id}`} key={c.id}>
							<a>
								<Card className="h-32 overflow-hidden">
									<div>
										<h2>{c.name}</h2>
										<p className="text-xs">
											{c.city}, {c.country}
										</p>
										<p className="text-xs">
											{c.users_count} users
										</p>
										<p className="text-xs">
											{c.language.name}
										</p>
									</div>
								</Card>
							</a>
						</Link>
					))}
			</CardGrid>
		</>
	);
}

export default CampusesIndex;
