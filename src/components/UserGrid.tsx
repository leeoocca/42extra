function UserGrid({ children }: { children: React.ReactNode }) {
	return <div className="grid grid-cols-4 gap-2">{children}</div>;
}

export default UserGrid;
