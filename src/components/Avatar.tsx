import Image from "next/image";
import styles from "./Avatar.module.css";

function Avatar({
	url,
	size,
	className,
}: {
	url: string | null;
	size: number;
	className?: string;
}) {
	return (
		<div
			className={styles.container + " " + className}
			style={{ width: !className && size, height: !className && size }}
		>
			{url && (
				<Image
					src={url}
					height={size * 2}
					width={size * 2}
					className={styles.avatar}
					quality={75}
				/>
			)}
		</div>
	);
}

export default Avatar;

export function LoadingAvatar({ size }: { size: number }) {
	return (
		<div
			className={styles.container}
			style={{ width: size, height: size }}
		></div>
	);
}

export function ErrorAvatar({ size }: { size: number }) {
	return <Avatar url="https://cdn.intra.42.fr/users/3b3.jpg" size={size} />;
}
