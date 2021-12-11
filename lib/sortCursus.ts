function dateOrNow(date) {
	return (date ? new Date(date) : Date.now()).valueOf();
}

export default function sortCursus(a, b) {
	return dateOrNow(b.end_at) - dateOrNow(a.end_at);
}
