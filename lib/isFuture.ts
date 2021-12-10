export default function isFuture(date: Date) {
	date = new Date(date);
	return date.valueOf() - Date.now() > 0;
}
