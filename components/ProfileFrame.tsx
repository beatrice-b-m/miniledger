"use client";
import { linkBigCartelAccountId } from "@/apis/bigcartel";
import { User } from "@prisma/client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function ProfileFrame({ user }: { user: User }) {
	const linkBigCartel = async () => {
		await linkBigCartelAccountId(user.id);
		redirect("/user/profile");
	};
	return (
		<div className="border-gray_l bg-mg m-auto flex h-max w-128 flex-col flex-nowrap gap-8 border-[1px] p-6">
			<div className="text-xl">{`Hi ${user.firstname}!`}</div>
			{user.bigCartelId ? (
				<div className="">{`BigCartel ID: ${user.bigCartelId}`}</div>
			) : (
				<div>No BigCartel account linked yet</div>
			)}
			<button
				onClick={linkBigCartel}
				className="flat-button h-max w-max p-2"
			>
				Link BigCartel Account
			</button>
			<Link href="/user/logout" className="flat-button h-max w-max p-2">
				Logout
			</Link>
		</div>
	);
}
