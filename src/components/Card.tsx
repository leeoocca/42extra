function Card({
	children,
	className,
	backgroundImageURL,
	backgroundColor,
}: {
	children: React.ReactNode;
	className?: string;
	backgroundImageURL?: string;
	backgroundColor?: string;
}) {
	return (
		<div
			className={
				className +
				" border border-white border-opacity-25 rounded hover:border-opacity-50 relative group"
			}
			style={{
				backgroundColor: backgroundColor || "",
			}}
		>
			{backgroundImageURL && (
				<>
					<img
						src={backgroundImageURL}
						className="absolute inset-0 object-cover w-full h-full opacity-70 group-hover:opacity-80"
					/>
				</>
			)}
			<div className="relative flex h-full p-2">{children}</div>
		</div>
	);
}
export default Card;
