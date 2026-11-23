import { NAV_DOMAINS, type NavDomain } from '#lib/config/navigation.js';

class NavState {
	isCommandOpen = $state(false);
	isDomainSheetOpen = $state(false);
	selectedDomain = $state<NavDomain | null>(null);

	openCommand = () => {
		this.isCommandOpen = true;
	};

	closeCommand = () => {
		this.isCommandOpen = false;
	};

	toggleCommand = () => {
		this.isCommandOpen = !this.isCommandOpen;
	};

	openDomainSheet = (domain?: NavDomain) => {
		this.selectedDomain = domain ?? NAV_DOMAINS[1]; // default to Learn if none provided
		this.isDomainSheetOpen = true;
	};

	closeDomainSheet = () => {
		this.isDomainSheetOpen = false;
	};

	toggleDomainSheet = (domain?: NavDomain) => {
		if (this.isDomainSheetOpen && (!domain || this.selectedDomain?.id === domain.id)) {
			this.isDomainSheetOpen = false;
		} else {
			this.openDomainSheet(domain);
		}
	};
}

export const navState = new NavState();
