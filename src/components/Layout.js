import Nav from "@components/Nav";

export default function Layout({ children, title }) {
	return (
		<div className="antialiased font-sans bg-gray-100 min-h-screen">
			<Nav />
			{title ? (
				<header className="bg-white shadow">
					<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold text-gray-900">
							{title}
						</h1>
					</div>
				</header>
			) : (
				""
			)}

			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<main>{children}</main>
				</div>
			</div>
		</div>
	);
}
