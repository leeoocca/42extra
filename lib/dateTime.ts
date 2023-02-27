// const dateOpts: Intl.DateTimeFormatOptions = {
// 	year: "numeric",
// 	month: "2-digit",
// 	day: "2-digit",
// };

export function formatDate(date: string | Date) {
	return new Date(date).toISOString().slice(0, 10);
}

const timeOpts: Intl.DateTimeFormatOptions = {
	hour: "numeric",
	minute: "numeric",
	hour12: false,
};

export function formatTime(
	date: string | Date,
	options?: { showSeconds?: boolean; timeZone?: string }
) {
	return new Date(date).toLocaleTimeString("en", {
		...timeOpts,
		second: options?.showSeconds ? "2-digit" : undefined,
		timeZone: options?.timeZone,
	});
}

export function formatDateTime(
	date: string | Date,
	options?: { showSeconds?: boolean; timeZone?: string }
) {
	return [formatDate(date), formatTime(date, options)].join(" ");
}

// date			YYYY-MM-DD
// time			HH:MM
// time			HH:MM:SS
// date time	YYYY-MM-DD HH:MM
// date time	YYYY-MM-DD HH:MM:SS
