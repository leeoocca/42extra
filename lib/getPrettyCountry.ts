export default function getPrettyCountry(str: string) {
	const split = str.split(", ");

	if (split.length === 1) return str;

	split.reverse();

	return split.join(" ");
}
