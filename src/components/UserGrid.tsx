function UserGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2">
			{children}
		</div>
	);
}

export default UserGrid;
