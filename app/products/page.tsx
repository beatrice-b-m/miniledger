import { listProducts, updateProducts } from "@/apis/bigcartel";
import NavFrame from "@/components/NavFrame";
import ProductFrame from "@/components/ProductFrame";
import { getCurrentSession } from "@/prisma/auth.server";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getCurrentSession();

	// redirect the user to login if they aren't authenticated
	if (user === null) {
		redirect("/user/login");
	} else {
		const products = await listProducts();
		return (
			<div className="flex h-[100vh] w-[100vw] flex-col overflow-clip">
				<div className="bg-mg border-gray_l m-auto h-max w-full border-b-[1px] pt-8 pb-8">
					<div className="m-auto max-w-6xl">
						<NavFrame user={user} />
					</div>
				</div>
				<div className="m-auto h-full w-full max-w-6xl pt-16 pb-16">
					<ProductFrame
						productList={products}
						updateHandler={updateProducts}
					/>
				</div>
			</div>
		);
	}
}
