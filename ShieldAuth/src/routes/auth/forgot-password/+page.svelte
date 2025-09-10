<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  let email = '';
  let loading = false;
  let message = '';
  let error = '';

  async function handleSubmit() {
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
      } else {
        error = data.error || 'Failed to send reset email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Forgot password error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Forgot Password - ShieldAuth</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center mb-6">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Forgot Password?</h1>
        <p class="text-gray-600 mt-2">
          Enter your email address and we'll send you a link to reset your password.
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
            </div>
          </div>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              bind:value={email}
              placeholder="Enter your email address"
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
            disabled={loading || !email}
            class="w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      {/if}

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </Card>
  </div>
</div>
