namespace NodeJS {
	interface ProcessEnv extends NodeJS.ProcessEnv {
		FT_UID: string;
		FT_SECRET: string;
		FT_REDIRECT: string;
		JWT_SECRET: string;
	}
}
