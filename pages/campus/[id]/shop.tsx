import { Card, Flex, Grid, Heading, Link } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import Image from "next/image";
import { useRouter } from "next/router";

import CampusHeader from "ui/headers/CampusHeader";
import Loading from "ui/Loading";

export default function CampusShop() {
	const {
		query: { id },
	} = useRouter();

	const { data: products, isLoading } = useAPI<any[]>(
		`/v2/campus/${id}/products`
	);

	if (isLoading) return <Loading />;

	return (
		<>
			<Grid variant="cards">
				{products
					.sort((a, b) => a.price - b.price)
					.map((product) => (
						<Card
							key={product.id}
							sx={{ flexDirection: "column", padding: 2 }}
						>
							{product.image && (
								<Flex
									sx={{
										width: "100%",
										backgroundColor: "text",
										justifyContent: "center",
									}}
								>
									<Image
										alt="product"
										src={`https://cdn.intra.42.fr${product.image.url.replace(
											"/uploads",
											""
										)}`}
										width={300}
										height={300}
										style={{ objectFit: "contain" }}
									/>
								</Flex>
							)}
							<code>#{product.id}</code>
							<Heading>{product.name}</Heading>
							<p>{product.description}</p>
							<p>{product.price}₳</p>
							<Link
								onClick={() => console.log(product)}
								sx={{ alignSelf: "flex-end" }}
							>
								Print details in console
							</Link>
						</Card>
					))}
			</Grid>
		</>
	);
}

CampusShop.header = CampusHeader;
