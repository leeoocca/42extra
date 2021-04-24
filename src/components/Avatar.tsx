import Image from "next/image";

export default function Avatar({ url }: { url: string }) {
	return (
		<Image
			src={url}
			layout="fill"
			className="relative block object-cover object-center rounded-full"
			priority={true}
		/>
	);
}
