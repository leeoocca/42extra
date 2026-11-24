<script lang="ts">
	import * as Command from '#lib/components/ui/command/index.js';
	import { goto } from '$app/navigation';
	import { navState } from '#lib/state/nav-state.svelte.js';
	import { NAV_DOMAINS } from '#lib/config/navigation.js';
	import { setMode } from 'mode-watcher';
	import { authClient } from '#lib/client.ts';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import SquareArrowLeftExitIcon from '@lucide/svelte/icons/square-arrow-left-exit';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import CopyCheckIcon from '@lucide/svelte/icons/copy-check';
	import TerminalIcon from '@lucide/svelte/icons/terminal';

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			navState.toggleCommand();
		}
	}

	function navigateTo(href: string) {
		navState.closeCommand();
		goto(href);
	}

	function handleCopyUrl() {
		navState.closeCommand();
		navigator.clipboard.writeText(window.location.href);
	}

	async function handleSignOut() {
		navState.closeCommand();
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/signin';
				}
			}
		});
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Command.Dialog bind:open={() => navState.isCommandOpen, (v) => (navState.isCommandOpen = v)}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>

		{#each NAV_DOMAINS as domain (domain.id)}
			<Command.Group heading={domain.title}>
				{#each domain.items as item (item.href)}
					<Command.Item onSelect={() => navigateTo(item.href)}>
						{#if item.icon}
							<item.icon class="size-4 shrink-0 text-muted-foreground" />
						{/if}
						<span class="truncate font-medium">{item.title}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}

		<Command.Separator />

		<Command.Group heading="Quick Actions">
			<Command.Item onSelect={() => navigateTo('/query')}>
				<TerminalIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>42 API Query Tool</span>
			</Command.Item>
			<Command.Item
				onSelect={() => {
					setMode('light');
					navState.closeCommand();
				}}
			>
				<SunIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>Set Theme: Light</span>
			</Command.Item>
			<Command.Item
				onSelect={() => {
					setMode('dark');
					navState.closeCommand();
				}}
			>
				<MoonIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>Set Theme: Dark</span>
			</Command.Item>
			<Command.Item
				onSelect={() => {
					setMode('system');
					navState.closeCommand();
				}}
			>
				<MonitorIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>Set Theme: System</span>
			</Command.Item>
			<Command.Item onSelect={handleCopyUrl}>
				<CopyCheckIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>Copy Page URL</span>
			</Command.Item>
			<Command.Item
				onSelect={() => {
					navState.closeCommand();
					window.open('https://intra.42.fr', '_blank', 'noopener,noreferrer');
				}}
			>
				<ExternalLinkIcon class="size-4 shrink-0 text-muted-foreground" />
				<span>Open 42 Intranet</span>
			</Command.Item>
			<Command.Item onSelect={handleSignOut} class="text-destructive">
				<SquareArrowLeftExitIcon class="size-4 shrink-0" />
				<span>Sign out</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
