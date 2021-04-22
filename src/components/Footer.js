import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full text-center text-gray-600 text-sm my-4 font-light">
			<a
				href="https://github.com/leeoocca"
				className="text-gray-800 font-normal"
			>
				42next
			</a>{" "}
			— a project by{" "}
			<Link href="/users/lrocca">
				<a className="text-gray-800">lrocca</a>
			</Link>
		</footer>
	);
}
