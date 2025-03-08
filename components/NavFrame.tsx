import { User } from "@prisma/client";
import Link from "next/link";

function NavItem({ name, link }: { name: string; link: string }) {
	return (
		<Link
			href={link}
			className="flat-button h-8 w-38 text-center text-lg leading-8"
		>
			{name}
		</Link>
	);
}

export default function NavFrame({ user }: { user: User | null }) {
	return (
		<div className="m-auto flex h-max w-max flex-row justify-evenly gap-16">
			<NavItem name={"Summary"} link={"/"} />
			<NavItem name={"Products"} link={"/products"} />
			<NavItem name={"Orders"} link={"/orders"} />
			<NavItem name={"Transactions"} link={"/transactions"} />
			{user !== null ? (
				<NavItem name={"Profile"} link={"/user/profile"} />
			) : null}
		</div>
	);
}
