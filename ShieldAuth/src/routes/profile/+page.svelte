<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	
	let name = $page.data.user?.name || '';
	let email = $page.data.user?.email || '';
</script>

<svelte:head>
	<title>Profile - AuthApp</title>
	<meta name="description" content="Manage your profile" />
</svelte:head>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
		<p class="mt-2 text-slate-600 dark:text-slate-400">
			Manage your account information and preferences
		</p>
	</div>

	<!-- Profile Form -->
	<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
		<form method="POST" action="?/updateProfile" use:enhance class="space-y-6">
			<!-- Success Message -->
			{#if $page.form?.success}
				<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-green-800 dark:text-green-200">{$page.form.success}</p>
						</div>
					</div>
				</div>
			{/if}

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

			<!-- Name Field -->
			<div>
				<label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
					Full Name
				</label>
				<div class="mt-1">
					<input
						id="name"
						name="name"
						type="text"
						bind:value={name}
						required
						class="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
						placeholder="Enter your full name"
					/>
				</div>
			</div>

			<!-- Email Field -->
			<div>
				<label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
					Email Address
				</label>
				<div class="mt-1">
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						required
						class="appearance-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white bg-white dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors"
						placeholder="Enter your email"
					/>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<button
					type="submit"
					class="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
				>
					Update Profile
				</button>
			</div>
		</form>
	</div>

	<!-- Account Information -->
	<div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
		<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account Information</h3>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-slate-600 dark:text-slate-400">User ID</span>
				<span class="text-slate-900 dark:text-white font-mono text-sm">{$page.data.user?.id}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-slate-600 dark:text-slate-400">Role</span>
				<span class="text-slate-900 dark:text-white capitalize">{$page.data.user?.role || 'user'}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-slate-600 dark:text-slate-400">Account Status</span>
				<span class="text-green-600 dark:text-green-400 text-sm font-medium">Active</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-slate-600 dark:text-slate-400">Member Since</span>
				<span class="text-slate-900 dark:text-white">
					{$page.data.user?.createdAt ? new Date($page.data.user.createdAt).toLocaleDateString() : 'Unknown'}
				</span>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="mt-8 flex justify-between">
		<a
			href="/dashboard"
			class="px-6 py-3 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
		>
			Back to Dashboard
		</a>
		
		<form method="POST" action="/logout" class="inline">
			<button
				type="submit"
				class="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
			>
				Sign Out
			</button>
		</form>
	</div>
</div>