"use client";

// import { Transaction } from "@prisma/client";

// remove this
interface Transaction {
	id: number;
	name: string;
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
	return (
		<div className="border-gray_l flex flex-row flex-nowrap items-center justify-between border-[1px] p-2">
			<div className="text-gray_m">{`#${transaction.id}`}</div>
			<div className="text-lg">{transaction.name}</div>
		</div>
	);
}

export default function TransactionFrame({
	transactionList,
	updateHandler,
}: {
	transactionList: Transaction[];
	updateHandler: any;
}) {
	return (
		<div className="border-gray_l bg-mg m-auto flex h-max max-h-4/5 w-2xl flex-col flex-nowrap gap-8 border-[1px] p-6">
			<div className="flex flex-row flex-nowrap items-center justify-between">
				<div className="text-xl">Transactions</div>
				<button className="flat-button p-2" onClick={updateHandler}>
					Refresh
				</button>
			</div>
			<div className="border-gray_l flex flex-col flex-nowrap gap-2 overflow-x-clip overflow-y-auto border-[1px] p-4">
				{transactionList.length == 0 ? (
					<div>No transactions found...</div>
				) : (
					transactionList.map((transaction: Transaction) => (
						<TransactionItem transaction={transaction} />
					))
				)}
			</div>
		</div>
	);
}
