import NavFrame from "@/components/NavFrame";
import SummaryFrame from "@/components/SummaryFrame";
import { getCurrentSession } from "@/prisma/auth.server";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getCurrentSession();

	// redirect the user to login if they aren't authenticated
	if (user === null) {
		redirect("/user/login");
	} else
		return (
			<div className="flex h-[100vh] w-[100vw] flex-col overflow-clip">
				<div className="bg-mg border-gray_l m-auto h-max w-full border-b-[1px] pt-8 pb-8">
					<div className="m-auto max-w-6xl">
						<NavFrame user={user} />
					</div>
				</div>
				<div className="m-auto h-full w-full max-w-6xl pt-16 pb-16">
					<SummaryFrame />
				</div>
			</div>
		);
}
