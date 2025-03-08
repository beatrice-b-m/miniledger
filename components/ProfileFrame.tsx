import { User } from "@prisma/client";
import Link from "next/link";

function linkBigCartelAccount() {
	const params = {
		Accept: "application/vnd.api+json",
		"User-Agent":
			"MiniLedger Pre-Release Testing/0.1 (bbrownmulry@gmail.com)",
	};
}

export default function ProfileFrame({ user }: { user: User }) {
	return (
		<div className="border-gray_l m-auto flex h-max w-128 flex-col flex-nowrap gap-8 border-[1px] p-6">
			<div className="text-xl">{`Hi ${user.firstname}!`}</div>
			<Link
				href="/user/profile/bigcartel/link"
				className="flat-button h-max w-max p-2"
			>
				Link BigCartel Account
			</Link>
			<Link href="/user/logout" className="flat-button h-max w-max p-2">
				Logout
			</Link>
		</div>
	);
}
