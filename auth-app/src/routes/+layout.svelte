<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	// User dropdown state
	let showUserDropdown = false;
	
	// Toggle user dropdown
	function toggleUserDropdown() {
		showUserDropdown = !showUserDropdown;
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-dropdown')) {
			showUserDropdown = false;
		}
	}
	
	// Handle logout
	async function handleLogout() {
		try {
			const response = await fetch('/logout', { method: 'POST' });
			if (response.ok) {
				goto('/');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
	
	onMount(() => {
		// Always apply dark mode
		if (typeof document !== 'undefined') {
			document.documentElement.classList.add('dark');
		}
		
		// Add click outside listener
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>ShieldAuth - Secure Authentication</title>
	<meta name="description" content="A secure authentication application built with SvelteKit" />
</svelte:head>

<div class="min-h-screen bg-slate-900">
	<!-- Navigation -->
	<nav class="bg-slate-800 shadow-sm border-b border-slate-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<a href="/" class="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-all duration-200 relative group">
						ShieldAuth
						<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
					</a>
				</div>
				
				<!-- Navigation Links -->
				<div class="hidden md:flex items-center space-x-8">
					{#if !$page.data.user}
						<a href="/login" class="px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-300 bg-slate-800 hover:bg-slate-700 transition-all duration-200">
							Login
						</a>
						<a href="/register" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200">
							Register
						</a>
					{/if}
				</div>
				
				<!-- Right side - User menu -->
				<div class="flex items-center space-x-4">
					<!-- User menu -->
					{#if $page.data.user}
						<div class="relative user-dropdown">
							<button
								on:click={toggleUserDropdown}
								class="flex items-center space-x-2 p-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
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
								<svg class="w-4 h-4 transition-transform duration-200" class:rotate-180={showUserDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							
							<!-- Dropdown menu -->
							{#if showUserDropdown}
								<div class="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-50">
									<div class="px-4 py-2 border-b border-slate-700">
										<p class="text-sm font-medium text-white">{$page.data.user.name || 'User'}</p>
										<p class="text-xs text-slate-400 break-all">{$page.data.user.email}</p>
									</div>
									<a
										href="/dashboard"
										on:click={() => { if ($page.url.pathname === '/dashboard') { window.location.reload(); } }}
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/dashboard') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700'}"
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
										</svg>
										Dashboard
										{#if $page.url.pathname !== '/dashboard'}
											<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-200 group-hover:w-full"></span>
										{/if}
									</a>
									<a
										href="/profile"
										on:click={() => { if ($page.url.pathname === '/profile') { window.location.reload(); } }}
										class="flex items-center px-4 py-2 text-sm transition-all duration-200 relative group {($page.url.pathname === '/profile') ? 'text-slate-500 cursor-default opacity-50' : 'text-slate-300 hover:bg-slate-700'}"
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
										Profile
										{#if $page.url.pathname !== '/profile'}
											<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-300 transition-all duration-200 group-hover:w-full"></span>
										{/if}
									</a>
									<div class="border-t border-slate-700 my-1"></div>
									<button
										on:click={handleLogout}
										class="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-all duration-200 relative group"
									>
										<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Sign Out
										<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-200 group-hover:w-full"></span>
									</button>
								</div>
							{/if}
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
	
</div>
