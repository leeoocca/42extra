export default function isFuture(date: string) {
	return Date.parse(date) > Date.now();
}
