"use server";

import { prisma } from "@/prisma/client";
import { redirect } from "next/navigation";

function getBigCartelAuth(): string {
	const subdomain: string | undefined = process.env.BIGCARTEL_SUBDOMAIN;
	if (!subdomain) {
		throw new Error(
			"'BIGCARTEL_SUBDOMAIN' environment variable not defined!",
		);
	}

	const password: string | undefined = process.env.BIGCARTEL_PASSWORD;
	if (!password) {
		throw new Error(
			"'BIGCARTEL_PASSWORD' environment variable not defined!",
		);
	}

	// get the auth header contents
	const authHeader: string =
		"Basic " + Buffer.from(`${subdomain}:${password}`).toString("base64");
	return authHeader;
}

interface AccountInfo {
	data: [
		{
			id: string;
			type: string;
			attributes: Object;
			links: Object;
			relationships: Object;
			meta: {};
		},
	];
	meta: { count: string };
	included: [{ id: string; type: string; attributes: Object }];
	links: {};
}

async function updateBigCartelId(
	userId: number,
	bigCartelId: string,
): Promise<void> {
	await prisma.user.update({
		where: { id: userId },
		data: {
			bigCartelId: bigCartelId,
		},
	});
}

export async function linkBigCartelAccountId(userId: number) {
	const accountURL: string = "https://api.bigcartel.com/v1/accounts";

	try {
		const authHeader: string = getBigCartelAuth();

		const userAgent: string | undefined = process.env.USER_AGENT;
		if (!userAgent) {
			throw new Error("'userAgent' environment variable not defined!");
		}

		const headers: Headers = new Headers({
			Accept: "application/vnd.api+json",
			"User-Agent": userAgent,
			Authorization: authHeader,
		});

		const response = await fetch(accountURL, {
			method: "GET",
			headers: headers,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data: AccountInfo = await response.json();

		await updateBigCartelId(userId, data.data[0].id);
	} catch (error) {
		console.error("Failed to fetch account info:", error);
	}
}
