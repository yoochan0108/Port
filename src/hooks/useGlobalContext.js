import { creatrContext, useContext, useState } from 'react';

export const GlobalContext = creatrContext();

export function GlobalProvider({ children }) {
	const [MenuOpen, setMenuOpen] = useState(false);

	return (
		<GlobalContext.Provider value={(MenuOpen, setMenuOpen)}>{children}</GlobalContext.Provider>
	);
}

export function useGlobalData() {
	const GlobalContext = useContext(GlobalContext);
	return GlobalContext;
}
