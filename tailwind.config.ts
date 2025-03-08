import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				fg: "#f9f7f7",
				mg: "#f1eee9",
				bg: "#e4e2df",
				gray_l: "#9a9a9a",
				gray_m: "#757475",
				gray_d: "#4a4a4a",
				gray_xd: "#2c2c2c",
				accent_xl: "#ffa1ad",
				accent_l: "#ff637e",
				accent_m: "#ff2056",
				accent_d: "#c70036",
			},
			boxShadow: {
				out_2px: "2px 2px rgb(0 0 0 / 0.3)",
				out_2px_dark: "2px 2px rgb(0 0 0 / 0.6)",
				in_2px: "2px 2px rgb(0 0 0 / 0.3) inset",
				in_2px_dark: "2px 2px rgb(0 0 0 / 0.6) inset",
				down: "0px 1px rgb(0 0 0 / 0.3)",
			},
		},
	},
	plugins: [],
} satisfies Config;
