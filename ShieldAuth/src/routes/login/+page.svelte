<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	// Redirect if already logged in
	$: if ($page.data.user) {
		goto('/');
	}
</script>

<svelte:head>
	<title>Login - ShieldAuth</title>
	<meta name="description" content="Sign in to your account" />
</svelte:head>

<!-- Two Panel Layout -->
<div class="min-h-screen flex">
	<!-- Left Panel - Graphics and Welcome (65%) -->
	<div class="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900 relative overflow-hidden">
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-10">
			<svg class="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
						<path d="M 10 0 L 0 0 0 10" fill="none" stroke="sky-300" stroke-width="0.5"/>
					</pattern>
				</defs>
				<rect width="100" height="100" fill="url(#grid)" />
			</svg>
		</div>
		
		<!-- Content -->
		<div class="relative z-10 flex flex-col justify-center items-center px-12 text-white w-full">
			<!-- Text Overlay Background -->
			<div class="absolute inset-0 bg-black/20 rounded-2xl"></div>
			<div class="relative z-20 max-w-lg text-center p-8">
				<!-- Logo -->
				<div class="mb-12">
					<h1 class="text-5xl font-bold mb-4 text-white">ShieldAuth</h1>
					<p class="text-sky-200 text-xl">Secure Authentication Platform</p>
				</div>
				
				<!-- Welcome Text -->
				<div class="mb-12">
					<h2 class="text-4xl font-semibold mb-6 text-white">Welcome Back!</h2>
					<p class="text-sky-200 text-lg leading-relaxed">
						Sign in to access your secure dashboard and manage your account with confidence.
					</p>
				</div>
				
				<!-- Features -->
				<div class="flex justify-center space-x-8">
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Secure database sessions</span>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Advanced security features</span>
					</div>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-12 h-12 bg-sky-800/30 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<span class="text-sky-200 text-sm text-center">Lightning fast performance</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Decorative Elements -->
		<div class="absolute top-20 right-20 w-32 h-32 bg-sky-500/20 rounded-full blur-xl"></div>
		<div class="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
		<div class="absolute top-1/2 left-10 w-16 h-16 bg-sky-400/10 rounded-full blur-lg"></div>
	</div>
	
	<!-- Right Panel - Login Form (35%) -->
	<div class="flex-1 lg:w-[35%] flex flex-col justify-center px-8 bg-slate-50 dark:bg-slate-900">
		<!-- Mobile Logo -->
		<div class="lg:hidden text-center mb-8">
			<a href="/" class="text-3xl font-bold text-slate-700 dark:text-slate-300">
				ShieldAuth
			</a>
		</div>
		
		<!-- Form Container with Rectangle Background -->
		<div class="mx-auto w-full max-w-md">
			<!-- Rectangle Background with 2cm spacing -->
			<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 m-8">
				<!-- Form Header -->
				<div class="text-center mb-8">
					<h2 class="text-2xl font-bold text-slate-800 dark:text-white">
						Sign in
					</h2>
					<p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Don't have an account?{' '}
						<a href="/register" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
							Sign up
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
									<p class="text-sm text-red-700 dark:text-red-200">{$page.form.error}</p>
								</div>
							</div>
						</div>
					{/if}
					
					<!-- Email Field -->
					<div>
						<label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Email address
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
								</svg>
							</div>
							<input
								id="email"
								name="email"
								type="email"
								required
								class="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
								placeholder="Enter your email"
							/>
						</div>
					</div>
					
					<!-- Password Field -->
					<div>
						<label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
							Password
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<input
								id="password"
								name="password"
								type="password"
								required
								class="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
								placeholder="Enter your password"
							/>
						</div>
					</div>
					
					<!-- Forgot Password Link -->
					<div class="text-right">
						<a href="/auth/forgot-password" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
							Forgot your password?
						</a>
					</div>
					
					<!-- Submit Button -->
					<div>
						<button
							type="submit"
							class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
							</svg>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>