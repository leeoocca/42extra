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

function ClusterMap({ data }) {
	const out = [];

	for (let row = 1; row <= data.rows; row++) {
		const mapRow = [];

		for (var col = 1; col <= data.cols; col++) {
			const fullHost = data.prefix + "r" + row + "p" + col;
			mapRow.push(
				<div
					id={fullHost}
					key={fullHost}
					title={fullHost}
					className={`md:mx-2 mx-1 w-8 h-8 bg-cover bg-center rounded text
						${data.unavailableCols.includes(col) ? "bg-gray-300" : "bg-green-600"}`}
					// ${col % 2 ? "mb-4" : "mt-4"}
				></div>
			);
		}
		out.push(
			<div
				key={data.prefix + "r" + row}
				id={data.prefix + "r" + row}
				className={`flex flex-row-reverse justify-center ${
					data.hallways.includes(row) ? "mt-10" : "md:mt-4 mt-2"
				}`}
			>
				{mapRow}
			</div>
		);
	}
	const totalLocations =
		data.rows * data.cols - data.unavailableCols.length * data.rows;
	const availibleLocations = totalLocations - 5;
	const percentage =
		100 - Math.trunc((availibleLocations / totalLocations) * 100) + "%";
	return (
		<div>
			<h3 className="order-last">
				{data.label} : {percentage}
			</h3>
			<div className="flex flex-col-reverse" id={data.prefix}>
				{out}
			</div>
		</div>
	);
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

	const cluster = [
		{
			rows: 12,
			cols: 8,
			prefix: "e3",
			hallways: [3, 9],
			unavailableCols: [2, 4, 6, 8],
			label: "3º piano",
		},
		{
			rows: 14,
			cols: 4,
			prefix: "e4",
			hallways: [],
			unavailableCols: [2, 3],
			label: "4º piano",
		},
	];

	const locations = [
		{
			login: "lrocca",
			host: "e3r2p5",
		},
		{
			login: "mcossu",
			host: "e3r1p2",
		},
		{
			login: "ade-feli",
			host: "e3r8p7",
		},
		{
			login: "marvin",
			host: "e3r9p3",
		},
		{
			login: "usavoia",
			host: "e3r12p1",
		},
	];

	// locations.forEach((location) => {
	// 	const avatar = "url(https://cdn.intra.42.fr/users/small_" + location.login + ".jpeg)";
	// 	activeHost = document.getElementById(location.host);
	// 	activeHost.style.backgroundImage = avatar;
	// 	activeHost.classList.remove("bg-green-600");
	// 	activeHost.classList.add("bg-red-500");
	// })

	// stats = document.getElementById("stats");
	// stats.innerHTML = availibleLocations + " / " + totalLocations + `<br><code class="font-mono ml-2">` + Math.trunc(percentage) + "%</code>";

	return (
		<Layout title="Cluster maps">
			<h1 className="text-3xl">Rome</h1>
			<h2
				id="stats"
				className="mt-8 text-center font-xl font-medium text-gray-500"
			>
				Ciao
			</h2>

			<div className="flex flex-row w-full justify-around items-center flex-wrap">
				<ClusterMap data={cluster[0]} id={cluster[0].prefix} />
				<ClusterMap data={cluster[1]} id={cluster[1].prefix} />
			</div>
		</Layout>
	);
}
