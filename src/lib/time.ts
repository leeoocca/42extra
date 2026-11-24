function formatDuration(from: string | number, to: string | number) {
	const ms = new Date(to).getTime() - new Date(from).getTime();
	const mins = Math.floor(ms / 60000);
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	const remMins = mins % 60;
	return `${hours}h ${remMins}m`;
}

function formatTimeSince(isoDate: string) {
	return formatDuration(isoDate, Date.now());
}

export { formatDuration, formatTimeSince };
