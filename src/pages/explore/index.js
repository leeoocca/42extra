export default function Explore() {
	return (<div>
		<div class="pb-32 bg-gray-800">
			<nav class="bg-gray-800">
				<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div class="border-b border-gray-700">
						<div class="flex items-center justify-between h-16 px-4 sm:px-0">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<img class="w-8 h-8" src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg" alt="Workflow logo" />
								</div>
								<div class="hidden md:block">
									<div class="flex items-baseline ml-10 space-x-4">
										<button class="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:text-white focus:bg-gray-700 text-white bg-gray-900">Dashboard</button>
										<button class="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:text-white focus:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">Team</button>
										<button class="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:text-white focus:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">Projects</button>
										<button class="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:text-white focus:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">Calendar</button>
										<button class="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:text-white focus:bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-700">Reports</button>
									</div>
								</div>
							</div>
							<div class="hidden md:block">
								<div class="flex items-center ml-4 md:ml-6">
									<button class="p-1 text-gray-400 border-2 border-transparent rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700" aria-label="Notifications">
										<svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
										</svg>
									</button>
									<div class="relative ml-3">
										<div>
											<button class="flex items-center max-w-xs text-sm text-white rounded-full focus:outline-none focus:shadow-solid" id="user-menu" aria-label="User menu" aria-haspopup="true">
												<img class="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<header class="py-10">
				<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<h1 class="relative inline-block text-3xl font-bold leading-9 text-white">Dashboard</h1>
				</div>
			</header>
		</div>
		<main class="-mt-32">
			<div class="px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div class="px-5 py-6 bg-white rounded-lg shadow sm:px-6">
					<div class="relative overflow-hidden rounded-lg h-96">
						<div class="absolute inset-0 p-8 text-3xl rounded-lg text-white font-bold bg-gradient-to-r from-teal-400 to-blue-400">Dashboard page content</div>
					</div>
				</div>
			</div>
		</main>
	</div>)
}
