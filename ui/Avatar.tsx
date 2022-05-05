import { Box, Avatar as TAvatar } from "@theme-ui/components";
import { AVATAR_DEFAULT } from "lib/constants";
import Image from "next/image";

export default function Avatar({
	url,
	size,
	deprecated = false,
}: {
	url: string;
	size: number;
	deprecated?: boolean;
}) {
	return (
		<Box
			sx={{
				w: size,
				h: size,
				filter: `grayscale(${deprecated ? "1" : "0"})`,
			}}
		>
			<TAvatar
				src={url ? url : AVATAR_DEFAULT}
				sx={{ height: size, width: size, objectFit: "cover" }}
			/>
		</Box>
	);
}
