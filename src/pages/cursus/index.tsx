import Card from "@/components/Card";
import useAPI from "@/lib/useAPI";
import Link from "next/link";

function Cursuses() {
	const { data: cursuses } = useAPI(`/v2/cursus?sort=id`);

	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Cursuses</h1>
			<div className="grid grid-cols-3 gap-2">
				{cursuses &&
					cursuses.map((cursus) => (
						<Link href={`/cursus/${cursus.slug}`} key={cursus.id}>
							<a>
								<Card className="h-32 overflow-hidden">
									<div>
										<h2>{cursus.name}</h2>
										<p className="text-xs">#{cursus.id}</p>
									</div>
								</Card>
							</a>
						</Link>
					))}
			</div>
		</>
	);
}

export default Cursuses;
