import Image from "next/image";
import { useSession } from "next-auth/client";

export default function Profile() {
	const [session, loading] = useSession();

	return (
		<>
			{loading ? (
				<p>"Loading..."</p>
			) : (
				<h1 className="">Hi {session.name}</h1>
			)}
			{/* <div className="w-8">
				<Image src={user.image_url} layout="fill" objectFit="contain" />
			</div> */}
		</>
	);
}
