import { User, Profile, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User as FtUser } from "types/User";

declare module "next-auth" {
	interface Session {
		user?: {
			id: string;
			login: string;
			image: string;
			name: string;
			fullName: string;
			campus: number;
		};
		accessToken: string;
	}
	interface User {
		id: string;
		login: string;
		image: string;
		name: string;
		fullName: string;
		campus: number;
	}
	interface Profile extends FtUser {}
}

declare module "next-auth/jwt" {
	interface JWT {
		user?: {
			id: string;
			login: string;
			image: string;
			name: string;
			fullName: string;
			campus: number;
		};
		accessToken: string;
	}
}
