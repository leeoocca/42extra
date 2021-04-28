import { getLayout as getMainLayout } from "@/components/layouts/MainLayout";

function SimpleLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex-grow w-full px-4 py-6 mx-auto max-w-7xl">
			{children}
		</main>
	);
}
export const getLayout = (page: React.ReactNode) =>
	getMainLayout(<SimpleLayout>{page}</SimpleLayout>);

export default SimpleLayout;
