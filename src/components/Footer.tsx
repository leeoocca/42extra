import Link from "next/link";
import { useTheme } from "next-themes";
import { useRef } from "react";

export default function Footer() {
	const { theme, setTheme } = useTheme();
	const selectTheme = useRef();
	return (
		<footer className="w-full my-4 text-sm font-light text-center text-gray-400">
			<a
				href="https://github.com/leeoocca"
				className="font-normal text-gray-200"
			>
				42extra
			</a>{" "}
			— a project by{" "}
			<Link href="/u/lrocca">
				<a className="text-gray-200">lrocca</a>
			</Link>
			<div>
				<label htmlFor="theme" className="m-2 text-sm">
					Theme
				</label>
				<select
					name="theme"
					id="select-theme" //text-black
					className="w-24 p-1 text-sm border-gray-500 rounded text-foreground hover:border-foreground focus:border-foreground bg-background focus:ring-0"
					ref={selectTheme}
					value={theme}
					onChange={(e) => setTheme(e.target.value)}
				>
					<option value="system">System</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</div>
		</footer>
	);
}
