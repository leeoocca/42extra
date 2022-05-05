import { Checkbox, Label } from "@theme-ui/components";
import getTimeAgo from "lib/getTimeAgo";
import { useState } from "react";

export default function RelativeTime({
	date,
	clickable = true,
	unit,
	bh = false,
}: {
	date: string;
	clickable?: boolean;
	unit?: Intl.RelativeTimeFormatUnit;
	bh?: boolean;
}) {
	const reset = bh ? 3 : 2;
	const [relative, setRelative] = useState(reset);
	const relativeValue = getTimeAgo(date || "", new Date(), unit);
	const days = (
		(Date.parse(date) - Date.now()) /
		1000 /
		60 /
		60 /
		24
	).toFixed();

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
						onChange={() =>
							setRelative(relative - 1 ? relative - 1 : reset)
						}
					/>
					{value}
				</Label>
		  )
		: (value) => value;

	return wrap(
		<time dateTime={date} title={date}>
			{(relative === 2 && relativeValue) ||
				(relative === 1 && date) ||
				(relative === 3 && `${days} days`)}
		</time>
	);
}
