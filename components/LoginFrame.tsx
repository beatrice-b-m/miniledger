"use client";
import { PageState } from "@/prisma/auth";
import { validateUserAction } from "@/prisma/auth.server";
import { useActionState } from "react";
import Form from "next/form";
import Link from "next/link";

export default function LoginFrame({ pageState }: { pageState: PageState }) {
	const [state, validateUser, pending] = useActionState(
		validateUserAction,
		pageState,
	);

	return (
		<div className="bg-mg m-auto h-max w-96 max-w-6xl border-[1px] border-gray-400 p-8">
			<div className="text-xl">Login</div>
			<Form action={validateUser}>
				<div className="mt-8">
					<label htmlFor="username">Username:</label>
					<br />
					<input
						type="text"
						name="username"
						placeholder="Username"
						className="border-gray_l w-full border-[1px] p-1"
						required
					/>
					<br />
				</div>
				<div className="mt-8">
					<label htmlFor="password">Password:</label>
					<br />
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="border-gray_l w-full border-[1px] p-1"
						required
						autoComplete="current-password"
					/>
				</div>
				<p className="text-accent_m mt-8 text-center text-lg">
					{state?.message}
				</p>
				<div className="mt-8 grid grid-cols-2 grid-rows-1 gap-8 text-sm">
					<Link
						href="/user/register"
						className="flat-button col-[1] h-full w-full p-1 text-center"
					>
						Register
					</Link>
					<input
						className="flat-button col-[2] h-full w-full p-1"
						type="submit"
						value="Submit"
						disabled={pending}
					/>
				</div>
			</Form>
		</div>
	);
}
