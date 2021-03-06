import { locale } from "./constants";

// https://stackoverflow.com/a/53800501/14477874
// https://stackoverflow.com/a/66390028/14477874
const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
	{ unit: "year", ms: 31536000000 },
	{ unit: "month", ms: 2628000000 },
	{ unit: "week", ms: 604800000 },
	{ unit: "day", ms: 86400000 },
	{ unit: "hour", ms: 3600000 },
	{ unit: "minute", ms: 60000 },
	{ unit: "second", ms: 1000 },
];

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 * @param unit      - the minimum unit to be used
 */
export function getTimeAgo(
	relative: string,
	pivot: Date = new Date(),
	unit: Intl.RelativeTimeFormatUnit = "second"
): string {
	if (!relative.length) return null;
	const date = new Date(relative);
	const elapsed = date.getTime() - pivot.getTime();
	return relativeTimeFromElapsed(elapsed, unit);
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 * @param minUnit   - the minimum unit to be used
 */
export function relativeTimeFromElapsed(
	elapsed: number,
	minUnit: Intl.RelativeTimeFormatUnit
): string {
	const rtf = new Intl.RelativeTimeFormat(locale, {
		numeric: "auto",
	});
	for (const { unit, ms } of units) {
		if (Math.abs(elapsed) > ms || unit === minUnit) {
			return rtf.format(Math.round(elapsed / ms), unit);
		}
	}
	return "";
}

export default getTimeAgo;
