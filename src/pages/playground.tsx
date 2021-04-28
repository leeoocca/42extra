import Avatar, { ErrorAvatar } from "@components/Avatar";
import Card from "@components/Card";

function Playground() {
	return (
		<>
			<Card className="mb-4">card content</Card>
			<Avatar
				url="https://cdn.intra.42.fr/users/cserapon.jpg"
				size={100}
			/>
			<ErrorAvatar size={100} />
		</>
	);
}

export default Playground;
