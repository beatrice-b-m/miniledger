"use client";

// import { Order } from "@prisma/client";

// remove this
interface Order {
	id: number;
	name: string;
}

function OrderItem({ order }: { order: Order }) {
	return (
		<div className="border-gray_l flex flex-row flex-nowrap items-center justify-between border-[1px] p-2">
			<div className="text-gray_m">{`#${order.id}`}</div>
			<div className="text-lg">{order.name}</div>
		</div>
	);
}

export default function OrderFrame({
	orderList,
	updateHandler,
}: {
	orderList: Order[];
	updateHandler: any;
}) {
	return (
		<div className="border-gray_l bg-mg m-auto flex h-max max-h-4/5 w-2xl flex-col flex-nowrap gap-8 border-[1px] p-6">
			<div className="flex flex-row flex-nowrap items-center justify-between">
				<div className="text-xl">Orders</div>
				<button className="flat-button p-2" onClick={updateHandler}>
					Refresh
				</button>
			</div>
			<div className="border-gray_l flex flex-col flex-nowrap gap-2 overflow-x-clip overflow-y-auto border-[1px] p-4">
				{orderList.length == 0 ? (
					<div>No orders found...</div>
				) : (
					orderList.map((order: Order) => <OrderItem order={order} />)
				)}
			</div>
		</div>
	);
}
