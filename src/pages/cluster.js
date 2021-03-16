import React from "react";
import { useUserState } from "@context/user";
import Layout from "@components/layout";
import useAPI from "@utils/useAPI";

// const locations = [
// 	{
// 		host: "e3r1p1",
// 		availible: true,
// 	},
// 	{
// 		host: "e3r1p2",
// 		availible: false,
// 	},
// 	{
// 		host: "e3r1p3",
// 		availible: true,
// 	},
// ];

export function ClusterRow({ positions, row }) {
	const final = [];
	for (var i = 1; i < positions + 1; i++)
		final.push(
			<p className="mr-2">
				e3r{row}p{i}
			</p>
		);
	return <div className="flex flex-row-reverse justify-center">{final}</div>;
}

export default function Profile() {
	// const { token } = useUserState();
	// const [locations, setLocations] = React.useState(false);

	// async function getLocations() {
	// 	const result = await fetch(
	// 		"https://api.intra.42.fr/v2/campus/30/locations",
	// 		{
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		}
	// 	).then((response) => response.json());
	// 	// setLocations(result);
	// 	console.log(result);
	// }

	// const { data } = useAPI("me");
	// getLocations();

	const final = [];
	for (var i = 12; i > 0; i--) {
		final.push(<ClusterRow positions={8} row={i} />);
	}

	return (
		<Layout>
			<h1>Ciao</h1>
			{/* {locations.map((location) => (
				<p key={location.host}>{location.host}</p>
			))} */}
			{final}
		</Layout>
	);
}
