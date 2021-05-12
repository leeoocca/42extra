import Card from "@/components/Card";
import useAPI from "@/lib/useAPI";
import Link from "next/link";

function CampusesIndex() {
	const { data: campuses } = useAPI(`/v2/campus?sort=id`);
	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Campuses</h1>
			<div className="grid grid-cols-3 gap-2">
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
			</div>
		</>
	);
}

export default CampusesIndex;
