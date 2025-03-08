"use server";
import { Session, User } from "@prisma/client";
import {
	_findUser,
	_registerUser,
	createSession,
	generateSessionToken,
	invalidateAllSessions,
	LoginFormData,
	PageState,
	RegisterFormData,
	SessionValidationResult,
	validateSessionToken,
} from "@/prisma/auth";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/prisma/auth.zod";
import { SafeParseReturnType } from "zod";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { cache } from "react";
import bcrypt from "bcryptjs";

export const getCurrentSession = cache(
	// cache the results of the session cookie retrieval so we don't need to
	// repeatedly query the database
	async (): Promise<SessionValidationResult> => {
		const cookieStore: ReadonlyRequestCookies = await cookies();
		const token: string | null = cookieStore.get("session")?.value ?? null;
		if (token === null) {
			return { session: null, user: null };
		}
		const result: SessionValidationResult =
			await validateSessionToken(token);
		return result;
	},
);

export async function registerUserAction(
	prevState: PageState | void,
	formData: FormData,
): Promise<PageState | void> {
	"use server";
	// validate form data with zod
	const result: SafeParseReturnType<RegisterFormData, RegisterFormData> =
		await registerSchema.safeParseAsync(Object.fromEntries(formData));
	if (!result.success) {
		return {
			message:
				result.error.issues[0] != null
					? result.error.issues[0].message
					: "An unknown error occured!",
		};
	}

	// destructure output
	const { firstname, username, password } = result.data;

	// query the db to check if the username already exists
	const user: User | null = await _findUser(username);
	if (user !== null) {
		return { message: "Username already exists!" };
	}

	// otherwise salt+hash the password and register the user to the db
	const passwordHash: string = await bcrypt.hash(password, 10);
	await _registerUser(firstname, username, passwordHash);
	redirect("/");
}

export async function validateUserAction(
	prevState: PageState | void,
	formData: FormData,
): Promise<PageState | void> {
	"use server";
	// validate form data with zod
	const result: SafeParseReturnType<LoginFormData, LoginFormData> =
		await loginSchema.safeParseAsync(Object.fromEntries(formData));

	// return any zod errors
	if (!result.success) {
		return {
			message:
				result.error.issues[0] != null
					? result.error.issues[0].message
					: "An unknown error occured!",
		};
	}

	// destructure credentials output
	const { username, password } = result.data;

	// validate credentials in db
	const user: User | null = await validateCredentials(username, password);
	if (user !== null) {
		await handleSessionLogIn(user.id);
		redirect("/");
	} else {
		return { message: "Invalid credentials!" };
	}
}

async function validateCredentials(
	username: string,
	password: string,
): Promise<User | null> {
	try {
		// search for the user in the db
		const user: User | null = await _findUser(username);

		// if they exist, return the user if their password is correct
		// otherwise return null
		if (user !== null) {
			const userValidated: boolean = await bcrypt.compare(
				password,
				user?.hash,
			);
			return userValidated ? user : null;
		} else {
			return null;
		}
	} catch {
		return null;
	}
}

// session handler wrappers
async function handleSessionLogIn(userId: number): Promise<void> {
	// generate a session token and register it to the user
	const token: string = generateSessionToken();
	const session: Session = await createSession(token, userId);
	// set session token in browser
	await setSessionTokenCookie(token, session.expiresAt);
}

export async function handleSessionLogOut(userId: number): Promise<void> {
	// invalidate all sessions for the user and clear their
	// current browser session cookie
	//
	// this still risks the user having token cookies saved on other browsers,
	// but these will now be considered invalid and they'll have to log back in
	await invalidateAllSessions(userId);
	await deleteSessionTokenCookie();
}

// modify session cookies
export async function setSessionTokenCookie(
	token: string,
	expiresAt: Date,
): Promise<void> {
	"use server";
	// get cookies from the browser and set the session token
	const cookieStore: ReadonlyRequestCookies = await cookies();
	cookieStore.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		path: "/",
	});
}

export async function deleteSessionTokenCookie(): Promise<void> {
	"use server";
	const cookieStore: ReadonlyRequestCookies = await cookies();
	cookieStore.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 0,
		path: "/",
	});
}
