import { Grid, Spinner } from "@theme-ui/components";

export default function Loading() {
	return (
		<Grid sx={{ placeItems: "center" }}>
			<Spinner />
		</Grid>
	);
}
