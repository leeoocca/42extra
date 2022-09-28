import Link from "./Link";

export default function Footer({ intraLink }) {
	return (
		<footer className="w-full my-4 text-sm font-light text-center text-gray-400">
			{intraLink && (
				<>
					<Link
						href={intraLink}
						target="_blank"
						rel="noopener noreferrer"
						sx={{
							fontSize: "small",
							textAlign: "center",
						}}
					>
						This page on the Intra
					</Link>
					<br />
				</>
			)}
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
