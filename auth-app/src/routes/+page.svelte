<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Welcome to ShieldAuth - Secure Authentication</title>
	<meta name="description" content="A secure authentication application built with SvelteKit" />
</svelte:head>

<main class="min-h-screen relative flex flex-col justify-center items-center px-4 py-16">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0">
		<!-- Background Image -->
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
			 style="background-image: url('/images/backgrounds/dark-bg.jpg');"></div>
		
		<!-- Overlay for better text readability -->
		<div class="absolute inset-0 bg-black/30"></div>
		
		<!-- Subtle pattern overlay for texture -->
		<div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZTBmN2ZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+'); background-size: 40px 40px;"></div>
	</div>
	<div class="relative z-10 max-w-4xl w-full text-center space-y-8">
		<!-- Hero Section -->
		<div class="space-y-6">
			<div class="space-y-4">
				                        <h1 class="text-5xl md:text-6xl font-bold text-white">
                            Welcome to{' '}
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                ShieldAuth
                            </span>
                        </h1>
				<p class="text-xl font-semibold text-slate-300 max-w-2xl mx-auto">
					A secure, modern authentication application built with SvelteKit 5, featuring database sessions, 
					user management, and a beautiful dark interface.
				</p>
			</div>
			
			                    <!-- Feature highlights -->
                    <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
                        <div class="group bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-2xl hover:shadow-blue-400/10 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div class="w-12 h-12 bg-blue-900/30 group-hover:bg-blue-800/40 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                                <svg class="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">Secure Authentication</h3>
                            <p class="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Database sessions with bcrypt password hashing</p>
                        </div>
                        
                        <div class="group bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-2xl hover:shadow-indigo-400/10 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div class="w-12 h-12 bg-indigo-900/30 group-hover:bg-indigo-800/40 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                                <svg class="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">Protected Routes</h3>
                            <p class="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Secure dashboard and profile management</p>
                        </div>
                        
                    </div>
		</div>
		
		<!-- Call to Action -->
		<div class="space-y-4">
			{#if $page.data.user}
				<div class="space-y-4">
					<p class="text-lg text-white drop-shadow-lg">
						Welcome back, <span class="font-semibold text-blue-300">{$page.data.user.email}</span>!
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/dashboard"
							class="inline-flex justify-center items-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
						>
							Go to Dashboard
						</a>
						<a
							href="/profile"
							class="inline-flex justify-center items-center px-8 py-4 border border-blue-600 rounded-lg shadow-sm text-base font-medium text-blue-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
						>
							View Profile
						</a>
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					<p class="text-lg font-semibold text-slate-300">
						Get started with secure authentication today
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/register"
							class="inline-flex justify-center items-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
						>
							Get Started
						</a>
						                                <a
                                    href="/login"
                                    class="inline-flex justify-center items-center px-8 py-4 border border-blue-300 dark:border-blue-600 rounded-lg shadow-sm text-base font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                >
                                    Sign In
                                </a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
