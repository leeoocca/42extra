/** @jsxImportSource theme-ui */
import { Grid } from "@theme-ui/components";
import { keyframes } from "@emotion/react";

const animation = "5s ease-in-out forwards infinite";

const dashArrayStart = "0 500";
const dash = keyframes({
	from: {
		strokeDasharray: dashArrayStart,
	},
	"40%": {
		strokeDasharray: "500 0",
	},
	"80%": {
		strokeDasharray: dashArrayStart,
	},
});

const fill = keyframes({
	"0%": {
		fill: "var(--theme-ui-colors-background)",
	},
	"40%": {
		fill: "var(--theme-ui-colors-text)",
	},
	"70%": {
		fill: "var(--theme-ui-colors-background)",
	},
});

export default function Loader() {
	return (
		<Grid sx={{ placeItems: "center", minHeight: "calc(100vh - 2rem)" }}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				sx={{
					width: "4rem",
					strokeDasharray: dashArrayStart,
					fill: "background",
					stroke: "text",
					strokeWidth: 2,
					animation: `${dash} ${animation} 0.5s, ${fill} ${animation} 1s`,
				}}
			>
				<path d="M60.6575 14.4162c-2.5191 0-5.2673 1.0306-8.2444 3.0917-2.8627 2.0611-5.6108 4.8665-8.2445 8.4162-2.6336 3.5497-4.8665 7.672-6.6986 12.3667-1.8321 4.6948-2.9199 9.6186-3.2635 14.7714 8.7025-2.7482 15.5157-5.7826 20.4395-9.1033 5.0382-3.3207 8.6452-6.7559 10.8208-10.3056 2.1756-3.5497 3.2635-6.8704 3.2635-9.962 0-2.9772-.8016-5.2673-2.4047-6.8704-1.4886-1.6031-3.3779-2.4047-5.6681-2.4047Zm-16.6607 78.666c-8.2444 0-15.0003-2.7481-20.2676-8.2445C18.5764 79.3414 16 71.3832 16 60.9631c0-7.2139 1.2023-14.0843 3.607-20.6111 2.5191-6.6414 5.9543-12.5385 10.3055-17.6913 4.4658-5.1528 9.5613-9.2178 15.2867-12.1949C51.039 7.48859 57.2796 6 63.921 6c6.5269 0 11.5651 1.54584 15.1148 4.6375 3.5497 2.9772 5.3246 7.1567 5.3246 12.5385 0 4.2367-1.6603 8.588-4.981 13.0537-3.3207 4.4658-8.6453 8.7598-15.9737 12.882-7.3284 4.0077-17.0615 7.6719-29.1992 10.9926.5726 6.2979 2.3474 10.9354 5.3246 13.9126 2.9772 2.8626 6.9276 4.294 11.8514 4.294 5.2673 0 9.8476-1.2596 13.7408-3.7787 3.8932-2.6337 7.0994-5.5536 9.6185-8.7598l4.294 3.2634c-2.2901 4.1223-5.21 8.0155-8.7597 11.6797-3.4352 3.6642-7.3857 6.6414-11.8514 8.9315-4.3513 2.2901-9.1606 3.4352-14.4279 3.4352Z" />
			</svg>
		</Grid>
	);
}
