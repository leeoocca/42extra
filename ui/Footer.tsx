import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full my-4 text-sm font-light text-center text-gray-400">
			<a
				href="https://github.com/leeoocca/42extra"
				className="font-normal text-gray-200"
			>
				42extra
			</a>{" "}
			— a project by{" "}
			<Link href="/users/lrocca">
				<a className="text-gray-200">lrocca</a>
			</Link>
		</footer>
	);
}
