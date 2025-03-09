"use client";

import { Product } from "@prisma/client";

function ProductItem({ product }: { product: Product }) {
	return (
		<div className="border-gray_l flex flex-row flex-nowrap items-center justify-between border-[1px] p-2">
			<div className="text-gray_m">{`#${product.id}`}</div>
			<div className="text-lg">{product.name}</div>
		</div>
	);
}

export default function ProductFrame({
	productList,
	updateHandler,
}: {
	productList: Product[];
	updateHandler: any;
}) {
	return (
		<div className="border-gray_l bg-mg m-auto flex h-max max-h-4/5 w-2xl flex-col flex-nowrap gap-8 border-[1px] p-6">
			<div className="flex flex-row flex-nowrap items-center justify-between">
				<div className="text-xl">Products</div>
				<button className="flat-button p-2" onClick={updateHandler}>
					Refresh
				</button>
			</div>
			<div className="border-gray_l flex flex-col flex-nowrap gap-2 overflow-x-clip overflow-y-auto border-[1px] p-4">
				{productList.length == 0 ? (
					<div>No products found...</div>
				) : (
					productList.map((product: Product) => (
						<ProductItem product={product} />
					))
				)}
			</div>
		</div>
	);
}
