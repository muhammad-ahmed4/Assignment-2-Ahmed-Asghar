<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	
	// Dark mode store
	const isDarkMode = writable(false);
	
	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode.update(mode => !mode);
		// Apply dark mode to document
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', !$isDarkMode);
			localStorage.setItem('darkMode', (!$isDarkMode).toString());
		}
	}
	
	onMount(() => {
		// Check for saved dark mode preference
		const savedMode = localStorage.getItem('darkMode');
		if (savedMode !== null) {
			isDarkMode.set(savedMode === 'true');
		} else {
			// Check system preference
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			isDarkMode.set(prefersDark);
		}
	});
</script>

<svelte:head>
	<title>Welcome to ShieldAuth - Secure Authentication</title>
	<meta name="description" content="A secure authentication application built with SvelteKit" />
</svelte:head>

<main class="min-h-screen relative flex flex-col justify-center items-center px-4 py-16">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0">
		<!-- Background Images -->
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden" 
			 style="background-image: url('/images/backgrounds/light-bg.jpg');"></div>
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block" 
			 style="background-image: url('/images/backgrounds/dark-bg.jpg');"></div>
		
		<!-- Overlay for better text readability -->
		<div class="absolute inset-0 bg-black/50 dark:bg-black/30"></div>
		
		<!-- Subtle pattern overlay for texture -->
		<div class="absolute inset-0 opacity-10 dark:opacity-5" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZTBmN2ZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTIwIDIwYzAtNS41LTQuNS0xMC0xMC0xMHMtMTAgNC41LTEwIDEwIDQuNSAxMCAxMCAxMCAxMC00LjUgMTAtMTB6bTEwIDBjMC01LjUtNC41LTEwLTEwLTEwcy0xMCA0LjUtMTAgMTAgNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMHoiLz48L2c+PC9zdmc+'); background-size: 40px 40px;"></div>
	</div>
	<div class="relative z-10 max-w-4xl w-full text-center space-y-8">
		<!-- Hero Section -->
		<div class="space-y-6">
			<div class="space-y-4">
				                        <h1 class="text-5xl md:text-6xl font-bold text-white dark:text-white">
                            Welcome to{' '}
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-400 dark:to-indigo-400">
                                ShieldAuth
                            </span>
                        </h1>
				<p class="text-xl font-semibold text-white/90 dark:text-slate-300 max-w-2xl mx-auto">
					A secure, modern authentication application built with SvelteKit 5, featuring database sessions, 
					user management, and beautiful dark mode support.
				</p>
			</div>
			
			                    <!-- Feature highlights -->
                    <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                        <div class="group bg-blue-50/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Secure Authentication</h3>
                            <p class="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Database sessions with bcrypt password hashing</p>
                        </div>
                        
                        <div class="group bg-indigo-50/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-600 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-400/10 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                                <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">Protected Routes</h3>
                            <p class="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">Secure dashboard and profile management</p>
                        </div>
                        
                        <button 
                            on:click={toggleDarkMode}
                            class="group bg-cyan-50/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-cyan-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-slate-600 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-purple-400/10 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full text-left"
                        >
                            <div class="w-12 h-12 bg-cyan-100 dark:bg-purple-900/30 group-hover:bg-cyan-200 dark:group-hover:bg-purple-800/40 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                                {#if $isDarkMode}
                                    <!-- Sun icon for dark mode -->
                                    <svg class="w-6 h-6 text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                {:else}
                                    <!-- Moon icon for light mode -->
                                    <svg class="w-6 h-6 text-cyan-600 dark:text-purple-400 group-hover:text-cyan-700 dark:group-hover:text-purple-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                {/if}
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                {#if $isDarkMode}
                                    Dark Mode
                                {:else}
                                    Light Mode
                                {/if}
                            </h3>
                            <p class="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                                {#if $isDarkMode}
                                    Interactive dark mode feature
                                {:else}
                                    Interactive light mode feature
                                {/if}
                            </p>
                            <p class="text-sm text-slate-500 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-300 mt-1">
                                {#if $isDarkMode}
                                    Click to switch to Dark theme
                                {:else}
                                    Click to switch to Light theme
                                {/if}
                            </p>
                        </button>
                    </div>
		</div>
		
		<!-- Call to Action -->
		<div class="space-y-4">
			{#if $page.data.user}
				<div class="space-y-4">
					<p class="text-lg text-slate-700 dark:text-slate-300">
						Welcome back, <span class="font-semibold text-blue-600 dark:text-blue-400">{$page.data.user.email}</span>!
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
							class="inline-flex justify-center items-center px-8 py-4 border border-blue-300 dark:border-blue-600 rounded-lg shadow-sm text-base font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
						>
							View Profile
						</a>
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					<p class="text-lg font-semibold text-white/90 dark:text-slate-300">
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
