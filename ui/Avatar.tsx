import Image from "next/image";
import styles from "./Avatar.module.css";

function Avatar({
	url,
	size,
	className,
	deprecated = false,
}: {
	url: string | null;
	size: number;
	className?: string;
	deprecated?: boolean;
}) {
	return (
		<div
			className={`${styles.container}${className ? ` ${className}` : ""}`}
			style={{
				width: !className && size,
				height: !className && size,
				filter: `grayscale(${deprecated ? "1" : "0"})`,
			}}
		>
			{url && (
				<Image
					src={url}
					height={size * 2}
					width={size * 2}
					className={styles.avatar}
					quality={75}
					alt="user avatar"
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
	return (
		<Avatar url="https://cdn.intra.42.fr/users/default.jpg" size={size} />
	);
}
