function getBigCartelAuth() {
	const accountSubdomain: string | undefined =
		process.env.BIGCARTEL_SUBDOMAIN;
	const accountPassword: string | undefined = process.env.BIGCARTEL_PASSWORD;

	if (!accountSubdomain) {
		throw new Error(
			"'BIGCARTEL_SUBDOMAIN' environment variable not defined!",
		);
	}
	if (!accountPassword) {
		throw new Error(
			"'BIGCARTEL_PASSWORD' environment variable not defined!",
		);
	}

	// get the auth header contents
	const authHeader: string =
		"Basic " +
		Buffer.from(`${accountSubdomain}:${accountPassword}`).toString(
			"base64",
		);
	return authHeader;
}

function linkBigCartelAccount() {
	const accountURL: string = "https://api.bigcartel.com/v1/accounts";

	const params = {
		Accept: "application/vnd.api+json",
		"User-Agent":
			"MiniLedger Pre-Release Testing/0.1 (bbrownmulry@gmail.com)",
	};
}
