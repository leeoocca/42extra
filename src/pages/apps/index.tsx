import Card from "@/components/Card";
import CardGrid from "@/components/CardGrid";
import useAPI from "@/lib/useAPI";
import Link from "next/link";

function AppsIndex() {
	const { data: apps } = useAPI(`/v2/apps?sort=id`);
	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Apps</h1>
			<CardGrid>
				{apps &&
					apps.map((app) => (
						<Link href={`/apps/${app.id}`} key={app.id}>
							<a>
								<Card className="h-32 overflow-hidden">
									<div>
										<h2>{app.name}</h2>
										<p className="text-xs">
											{app.description}
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

export default AppsIndex;
