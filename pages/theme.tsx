import { useEffect, useState } from "react";

import { Box, Flex, Heading, Input, Label } from "@theme-ui/components";

function VariableControl({ variable }: { variable: string }) {
	const def = getComputedStyle(document.documentElement).getPropertyValue(
		`--theme-ui-colors-${variable}`
	);

	const [value, setValue] = useState(null);

	useEffect(() => {
		const s = new Option().style;
		s.color = value;
		document.documentElement.style.setProperty(
			`--theme-ui-colors-${variable}`,
			s.color
		);
	}, [value]);

	return (
		<Flex
			sx={{ alignItems: "center", justifyContent: "center", mb: "1rem" }}
		>
			<Box
				sx={{
					backgroundColor: value || def,
					width: "3rem",
					height: "3rem",
					border: "1px #fff solid",
					mr: ".5rem",
				}}
			/>
			<Box>
				<Label>{variable}</Label>
				<Input
					placeholder={def}
					onChange={(event) => setValue(event.target.value)}
				/>
			</Box>
		</Flex>
	);
}

export default function ThemeEditor() {
	return (
		<Box>
			<Heading mb="1rem" sx={{ textAlign: "center" }}>
				Theme
			</Heading>
			<VariableControl variable="background" />
			<VariableControl variable="text" />
			<VariableControl variable="muted" />
			<VariableControl variable="primary" />
		</Box>
	);
}
