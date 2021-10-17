import normalizeUrl from "normalize-url";

function WebsiteLink({ url }: { url: string | null }) {
	if (!url) return <></>;

	const normalizedUrl = normalizeUrl(url);

	return (
		<p>
			<a href={normalizedUrl} target="_blank" rel="noopener noreferrer">
				<b>Website</b> {normalizedUrl}
			</a>
		</p>
	);
}

export default WebsiteLink;
