function Card({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={
				className +
				" " +
				"p-2 border border-white border-opacity-25 rounded hover:border-opacity-50"
			}
		>
			{children}
		</div>
	);
}
export default Card;
