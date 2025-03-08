// set up according to the guide at https://lucia-auth.com/sessions/basic-api/prisma
import { Session, User } from "@prisma/client";
import { prisma } from "@/prisma/client";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
// import { cookies } from "next/headers";
// import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface PageState {
	message?: string;
}
export interface RegisterFormData {
	firstname: string;
	username: string;
	password: string;
	confirmPassword: string;
}
export interface LoginFormData {
	username: string;
	password: string;
}

export const _sessionDays: number = 14;
const _sessionExpireOffset: number = 1000 * 60 * 60 * 24 * _sessionDays;
const _sessionExtendDays: number = 7;
const _sessionExtendOffset: number = 1000 * 60 * 60 * 24 * _sessionExtendDays;
export const _sessionCookieOffset: number = 60 * 60 * 24 * _sessionDays;

// TODO: if i want to allow only ONE session to be logged out (leaving others logged in) i'll need to include the
// session ID in the browser cookies so I can selectively delete that one, for now logging out will log out ALL sessions
//
// async function handleSessionLogOut(): Promise<void> {
//     // get the current session token from the browser cookies (if its null we can't log anything out anyways)
//     const cookieStore: ReadonlyRequestCookies = await cookies();
//     const token = cookieStore.get("session");
// }

export function generateSessionToken(): string {
	// get an array of 20 cryptographically random bytes
	const bytes: Uint8Array = new Uint8Array(20);
	crypto.getRandomValues(bytes);

	// encode the byte array to a base32 string
	const token: string = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(
	token: string,
	userId: number,
	_sessionDays: number = 14,
): Promise<Session> {
	// sha256 hash the token to get the sessionID then create the session
	const sessionId: string = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token)),
	);

	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + _sessionExpireOffset),
	};

	// register session to the db then return it
	await prisma.session.create({
		data: session,
	});
	return session;
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export async function validateSessionToken(
	token: string,
): Promise<SessionValidationResult> {
	// sha256 hash the token to get the sessionId
	const sessionId: string = encodeHexLowerCase(
		sha256(new TextEncoder().encode(token)),
	);
	// search for the sessionId in the database
	const result: ({ user: User } & Session) | null =
		await prisma.session.findUnique({
			where: {
				id: sessionId,
			},
			include: {
				user: true,
			},
		});

	// if the session does not exist (result is null)
	if (result == null) return { session: null, user: null };

	// unpack results
	const { user, ...session } = result;

	// if the session has expired, delete it from the database
	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({ where: { id: sessionId } });
		return { session: null, user: null };
	}
	// if it hasn't expired, but it is close, extend its expiration date
	if (Date.now() >= session.expiresAt.getTime() - _sessionExtendOffset) {
		session.expiresAt = new Date(Date.now() + _sessionExpireOffset);
		await prisma.session.update({
			where: {
				id: session.id,
			},
			data: {
				expiresAt: session.expiresAt,
			},
		});
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	await prisma.session.deleteMany({
		where: {
			userId: userId,
		},
	});
}

// db user retrieval methods
export async function _findUser(username: string): Promise<User | null> {
	// query the username in the database
	return await prisma.user.findUnique({
		where: {
			username: username,
		},
	});
}

export async function _registerUser(
	firstname: string,
	username: string,
	hash: string,
): Promise<void> {
	await prisma.user.create({
		data: {
			firstname: firstname,
			username: username,
			hash: hash,
		},
	});
}
