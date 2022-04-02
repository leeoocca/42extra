import { Checkbox, Label, Text } from "@theme-ui/components";
import { useState } from "react";
import getTimeAgo from "lib/getTimeAgo";

export default function RelativeTime({
	date,
	clickable = true,
	precisionDay = false,
}: {
	date: string;
	clickable?: boolean;
	precisionDay?: boolean;
}) {
	const [relative, setRelative] = useState(true);
	const relativeValue = getTimeAgo(
		date,
		new Date(),
		precisionDay ? "day" : null
	);

	const wrap = clickable
		? (value) => (
				<Label
					sx={{
						display: "inline-flex",
						width: "fit-content",
						cursor: "pointer",
						textDecoration: "underline wavy #ffffff88",
						verticalAlign: "bottom",
					}}
				>
					<Checkbox
						sx={{ display: "none!important" }}
						onChange={() => setRelative(!relative)}
					/>
					{value}
				</Label>
		  )
		: (value) => value;

	return wrap(
		<time dateTime={date} title={date}>
			{relative ? relativeValue : date}
		</time>
	);
}
