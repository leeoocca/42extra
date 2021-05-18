function CardGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
			{children}
		</div>
	);
}

export default CardGrid;
