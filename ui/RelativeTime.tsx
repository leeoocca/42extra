import { Checkbox, Label, Text } from "@theme-ui/components";
import { useState } from "react";
import getTimeAgo from "lib/getTimeAgo";

export default function RelativeTime({
	date,
	clickable = true,
	unit,
}: {
	date: string;
	clickable?: boolean;
	unit?: Intl.RelativeTimeFormatUnit;
}) {
	const [relative, setRelative] = useState(reset);
	const relativeValue = getTimeAgo(date, new Date(), unit);

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
