import { App } from "types/42";
import AppCard from "ui/AppCard";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import useAPI from "lib/useAPI";

function AppsIndex() {
	const { data: apps } = useAPI<App[]>(`/v2/apps?sort=id`);
	return (
		<>
			<PageTitle title="Apps" />
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
