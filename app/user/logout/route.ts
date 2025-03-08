import { getCurrentSession, handleSessionLogOut } from "@/prisma/auth.server";
import { redirect } from "next/navigation";

export async function GET() {
	const logOut = async (userId: number) => await handleSessionLogOut(userId);

	// check if a user is logged in
	const { user } = await getCurrentSession();

	// if they are, log them out
	if (user !== null) {
		// sign them out
		logOut(user.id);
	}

	// finally redirect to home
	redirect("/");
}
