import Image from "next/image";

import Layout from "@components/layout";
import { useUserState } from "@context/user";

export default function Profile() {
	const { user, status } = useUserState();

	return (
		<Layout>
			{status === "loading" ? (
				<p>"Loading..."</p>
			) : (
				<h1 className="">Hi {user.login}</h1>
			)}
			{/* <div className="w-8">
				<Image src={user.image_url} layout="fill" objectFit="contain" />
			</div> */}
		</Layout>
	);
}
