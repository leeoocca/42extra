import campuses from "lib/campuses";

// import { Campus } from "types/User";
// import useAPI from "lib/useAPI";

export default async function getCampusCityFromId(campus_id: Number) {
	// const { data: campuses }: { data: Campus[] } = await useAPI(
	// 	"/v2/campus?page[size]=100"
	// );
	const campus = campuses.find((campus) => campus.id === campus_id);
	if (campus) return campus;
	return null;
}
