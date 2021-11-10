import Link from "next/link";
import { useKBar } from "kbar";
import UserDropdown from "./UserDropdown";
import { IconButton, Flex } from "@theme-ui/components";

function StatusBar() {
	const { query } = useKBar();
	return (
		<Flex as="nav">
			<nav className="flex items-center w-full p-4 mx-auto space-x-4 align-middle max-w-7xl">
				<Link href="/">
					<a>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 42 42"
							className="w-8 h-8 fill-current"
						>
							<path d="M4 28.69h12.593V35h6.284V23.597h-12.57L22.876 11h-6.284L4 23.597v5.093zm21.589-11.384L31.876 11h-6.287v6.306zm6.287 0l-6.287 6.291v6.287h6.287v-6.287l6.306-6.29V11h-6.306v6.306zM38.182 23.597l-6.306 6.287h6.306v-6.287z" />
						</svg>
					</a>
				</Link>
				<IconButton
					onClick={query.toggle}
					sx={{ fontSize: 3, color: "#ddd" }}
				>
					⌘
				</IconButton>
				<UserDropdown />
			</nav>
		</Flex>
	);
}

export default StatusBar;
