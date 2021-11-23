import { Fragment, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Avatar from "./Avatar";

function getButtonClasses(active: boolean) {
	return `w-full p-2 text-sm text-skin-text text-left ${
		active && "bg-white bg-opacity-10"
	}`;
}

export default function UserDropdown() {
	return <></>;
}
