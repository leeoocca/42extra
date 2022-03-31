function dateOrNow(date) {
	return date ? Date.parse(date) : Date.now();
}

export default function sortCursus(a, b) {
	return dateOrNow(b.end_at) - dateOrNow(a.end_at);
}
