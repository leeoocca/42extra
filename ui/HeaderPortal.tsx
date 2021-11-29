import { createPortal } from "react-dom";

export default function HeaderPortal({ children }) {
	return createPortal(children, document.getElementById("header"));
}
