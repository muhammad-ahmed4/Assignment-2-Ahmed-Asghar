<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	// Redirect if already logged in
	$: if ($page.data.user) {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Login - ShieldAuth</title>
	<meta name="description" content="Sign in to your account" />
</svelte:head>

<!-- Background with centered form -->
<div class="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
	<!-- Background Images -->
	<div class="absolute inset-0">
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden" 
			 style="background-image: url('/images/backgrounds/light-bg.jpg');"></div>
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block" 
			 style="background-image: url('/images/backgrounds/dark-bg.jpg');"></div>
		<!-- Overlay for better readability -->
		<div class="absolute inset-0 bg-black/50 dark:bg-black/30"></div>
	</div>
	
	<!-- Centered Form Container -->
	<div class="relative z-10 w-full max-w-md">
		<!-- Form Box -->
		<div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
			<!-- Logo and Title -->
			<div class="text-center mb-8">
				<a href="/" class="text-3xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 relative group">
					ShieldAuth
					<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
				</a>
				<h2 class="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
					Sign in to your account
				</h2>
				<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Or{' '}
					<a href="/register" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
						create a new account
					</a>
				</p>
			</div>
			
			<!-- Login Form -->
			<form method="POST" use:enhance class="space-y-6">
		<!-- Error Message -->
		{#if $page.form?.error}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-800 dark:text-red-200">{$page.form.error}</p>
					</div>
				</div>
			</div>
		{/if}
		
		<!-- Email Field -->
		<div>
			<label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
				Email address
			</label>
			<div class="mt-1">
				<input
					id="email"
					name="email"
					type="email"
					required
					class="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
					placeholder="Enter your email"
				/>
			</div>
		</div>
		
		<!-- Password Field -->
		<div>
			<label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
				Password
			</label>
			<div class="mt-1">
				<input
					id="password"
					name="password"
					type="password"
					required
					class="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
					placeholder="Enter your password"
				/>
			</div>
		</div>
		
		<!-- Submit Button -->
		<div>
			<button
				type="submit"
				class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
			>
				Sign in
			</button>
			</div>
		</form>
		</div>
	</div>
</div>
