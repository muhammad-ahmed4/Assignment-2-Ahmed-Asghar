<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  let token = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let message = '';
  let error = '';

  onMount(() => {
    token = $page.url.searchParams.get('token') || '';
    if (!token) {
      error = 'No reset token provided';
    }
  });

  async function handleSubmit() {
    if (!token) {
      error = 'No reset token provided';
      return;
    }

    if (!password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters long';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
        setTimeout(() => {
          goto('/dashboard?reset=true');
        }, 3000);
      } else {
        error = data.error || 'Password reset failed';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Password reset error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password - ShieldAuth</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center mb-6">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {#if message}
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          {/if}
        </div>
        <h1 class="text-2xl font-bold text-gray-900">
          {message ? 'Password Reset Successfully!' : 'Reset Your Password'}
        </h1>
        <p class="text-gray-600 mt-2">
          {message 
            ? 'Your password has been updated successfully.' 
            : 'Enter your new password below.'}
        </p>
      </div>

      {#if message}
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-green-800">{message}</p>
              <p class="text-sm text-green-700 mt-1">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      {:else if !error}
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Enter your new password"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              placeholder="Confirm your new password"
              required
              disabled={loading}
            />
          </div>

          {#if error}
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800">{error}</p>
            </div>
          {/if}

          <Button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            class="w-full"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      {/if}

      {#if error && !message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <Button 
            on:click={() => goto('/auth/forgot-password')} 
            variant="outline"
            class="w-full"
          >
            Request New Reset Link
          </Button>
        </div>
      {/if}

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <a href="/dashboard" class="font-medium text-blue-600 hover:text-blue-500">
            Back to Dashboard
          </a>
        </p>
      </div>
    </Card>
  </div>
</div>
