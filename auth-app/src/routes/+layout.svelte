<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	
	// Dark mode store
	const isDarkMode = writable(false);
	
	// Toggle dark mode
	function toggleDarkMode() {
		isDarkMode.update(mode => !mode);
	}
	
	// Apply dark mode to document
	$: if (typeof document !== 'undefined') {
		document.documentElement.classList.toggle('dark', $isDarkMode);
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
		
		// Save preference when it changes
		isDarkMode.subscribe(mode => {
			localStorage.setItem('darkMode', mode.toString());
		});
	});
</script>

<svelte:head>
	<title>Auth App - Secure Authentication</title>
	<meta name="description" content="A secure authentication application built with SvelteKit" />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
	<!-- Navigation -->
	<nav class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">
						AuthApp
					</a>
				</div>
				
				<!-- Navigation Links -->
				<div class="hidden md:flex items-center space-x-8">
					{#if $page.data.user}
						<a href="/dashboard" class="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
							Dashboard
						</a>
						<a href="/profile" class="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
							Profile
						</a>
					{:else}
						<a href="/auth/login" class="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
							Login
						</a>
						<a href="/auth/register" class="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
							Register
						</a>
					{/if}
				</div>
				
				<!-- Right side - Dark mode toggle and user menu -->
				<div class="flex items-center space-x-4">
					<!-- Dark mode toggle -->
					<button
						on:click={toggleDarkMode}
						class="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
						aria-label="Toggle dark mode"
					>
						{#if $isDarkMode}
							<!-- Sun icon -->
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						{:else}
							<!-- Moon icon -->
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
							</svg>
						{/if}
					</button>
					
					<!-- User menu -->
					{#if $page.data.user}
						<div class="relative">
							<button
								class="flex items-center space-x-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
								aria-label="User menu"
							>
								{#if $page.data.user.image}
									<img src={$page.data.user.image} alt="Profile" class="w-6 h-6 rounded-full" />
								{:else}
									<div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
										{$page.data.user.email?.charAt(0).toUpperCase()}
									</div>
								{/if}
								<span class="hidden sm:block">{$page.data.user.email}</span>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</nav>
	
	<!-- Main content -->
	<main class="flex-1">
		<slot />
	</main>
	
	<!-- Footer -->
	<footer class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8 mt-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center text-slate-600 dark:text-slate-400">
				<p>&copy; 2024 AuthApp. Built with SvelteKit and Auth.js.</p>
			</div>
		</div>
	</footer>
</div>
