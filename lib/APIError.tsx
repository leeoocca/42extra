import { Alert, Link, Close, Container, Text } from "@theme-ui/components";
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useMemo,
	useState,
} from "react";

interface IAPIErrorContext {
	errors: Error[];
	setErrors: Dispatch<SetStateAction<Error[]>>;
}

const APIErrorContext = createContext<Partial<IAPIErrorContext>>(null);

export function APIErrorProvider({ children }) {
	const [errors, setErrors] = useState<Error[]>([]);
	const ctx = useMemo(() => ({ errors, setErrors }), [errors]);

	return (
		<APIErrorContext.Provider value={ctx}>
			{children}
		</APIErrorContext.Provider>
	);
}

export function useAPIError() {
	const context = useContext(APIErrorContext);
	if (context === undefined) {
		throw new Error("useAPIError must be used within a APIErrorProvider");
	}
	return context;
}

export function APIErrorOutlet() {
	const { errors, setErrors } = useAPIError();

	if (!errors.length) return null;

	return (
		<Container
			pt={0}
			sx={{ display: "flex", flexDirection: "column", gap: 2 }}
		>
			<Link
				as="small"
				sx={{ textAlign: "center" }}
				onClick={() => setErrors([])}
			>
				Clear all
			</Link>
			{errors.map((error, i) => (
				<Alert key={i} bg="highlight">
					<Text>
						<Text variant="mono">
							{error?.name}
							{":"}
						</Text>{" "}
						{error?.message}
					</Text>
					<Close
						ml="auto"
						mr={-2}
						onClick={() => {
							setErrors(
								errors.filter((e, idx) => i !== idx) || []
							);
						}}
					/>
				</Alert>
			))}
		</Container>
	);
}
