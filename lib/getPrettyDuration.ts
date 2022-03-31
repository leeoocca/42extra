import prettyMilliseconds from "pretty-ms";

type param = string | number;

export default function getPrettyDuration(a: param, b: param = Date.now()) {
	if (typeof a === "string") a = Date.parse(a);
	if (typeof b === "string") b = Date.parse(b);

	return prettyMilliseconds(a > b ? a - b : b - a, {
		secondsDecimalDigits: 0,
		millisecondsDecimalDigits: 0,
		unitCount: 2,
	});
}
