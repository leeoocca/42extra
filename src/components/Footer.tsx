import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full text-center text-gray-400 text-sm my-4 font-light">
			<a
				href="https://github.com/leeoocca"
				className="text-gray-200 font-normal"
			>
				42next
			</a>{" "}
			— a project by{" "}
			<Link href="/users/lrocca">
				<a className="text-gray-200">lrocca</a>
			</Link>
		</footer>
	);
}
