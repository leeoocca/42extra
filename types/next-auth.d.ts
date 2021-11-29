import { User, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

import { User as FtUser } from "types/User";

declare module "next-auth" {
	interface Session {
		user?: User;
		accessToken: string;
		tokenExpires: number;
	}
	interface User {
		id: string;
		login: string;
		image: string;
		name: string;
		fullName: string;
		campus: number;
		staff: boolean;
	}
	interface Profile extends FtUser {}
}
declare module "next-auth/jwt" {
	interface JWT {
		user?: User;
		accessToken: string;
		refreshToken: string;
		expires: number;
		error: string;
	}
}
