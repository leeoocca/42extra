import { Box, Flex, Heading, Input, Label } from "@theme-ui/components";
import { useEffect, useState } from "react";

function VariableControl({ variable }: { variable: string }) {
	const def = getComputedStyle(document.documentElement).getPropertyValue(
		`--theme-ui-colors-${variable}`
	);

	const [value, setValue] = useState("");

	useEffect(() => {
		const s = new Option().style;
		s.color = value;
		document.documentElement.style.setProperty(
			`--theme-ui-colors-${variable}`,
			s.color
		);
	}, [value]);

	return (
		<Flex>
			<Box
				sx={{ backgroundColor: value, width: "3rem", height: "3rem" }}
			/>
			<Box>
				<Label>{variable}</Label>
				<Input
					placeholder={def}
					onChange={(event) => setValue(event.target.value)}
					mb="1rem"
				/>
			</Box>
		</Flex>
	);
}

export default function ThemeEditor() {
	return (
		<Box sx={{ width: "50%" }}>
			<Heading mb="1rem">Theme</Heading>
			<VariableControl variable="background" />
			<VariableControl variable="text" />
			<VariableControl variable="muted" />
			<VariableControl variable="primary" />
		</Box>
	);
}
