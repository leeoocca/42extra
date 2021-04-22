import Image from "next/image";

export default function Avatar({ url }) {
	return (
		<Image
			src={url}
			layout="fill"
			className="rounded-full block object-cover object-center"
		/>
	);
}
