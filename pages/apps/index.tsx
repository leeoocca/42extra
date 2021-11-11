import AppCard from "ui/AppCard";
import CardGrid from "ui/CardGrid";
import useAPI from "lib/useAPI";
import Loading from "ui/Loading";

function AppsIndex() {
	const { data: apps } = useAPI(`/v2/apps?sort=id`);
	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Apps</h1>
			<CardGrid>
				{apps ? (
					apps.map((app) => <AppCard key={app.id} app={app} />)
				) : (
					<Loading />
				)}
			</CardGrid>
		</>
	);
}

export default AppsIndex;
