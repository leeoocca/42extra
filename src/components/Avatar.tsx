import Image from "next/image";

export default function Avatar({ url }: { url: string }) {
	return (
		<Image
			src={url}
			layout="fill"
			className="rounded-full block object-cover object-center"
			priority={true}
		/>
	);
}
