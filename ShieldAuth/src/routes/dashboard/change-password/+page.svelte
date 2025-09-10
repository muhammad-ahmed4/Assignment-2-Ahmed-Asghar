<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  // Redirect if not authenticated
  $: if (!$page.data.user) {
    goto('/login');
  }
</script>

<svelte:head>
  <title>Change Password - ShieldAuth</title>
  <meta name="description" content="Change your account password" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
  <div class="max-w-md mx-auto">
    <Card>
      <div class="text-center mb-6">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">Change Password</h1>
        <p class="text-gray-600 mt-2">
          Enter your email address to receive a password reset link.
        </p>
      </div>

      {#if $page.form?.error}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-700">{$page.form.error}</p>
            </div>
          </div>
        </div>
      {/if}

      {#if $page.form?.success}
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-green-700">{$page.form.success}</p>
            </div>
          </div>
        </div>
      {/if}

      <form method="POST" use:enhance class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={$page.data.user?.email || ''}
            placeholder="Enter your email address"
            required
            readonly
            class="bg-gray-50"
          />
          <p class="text-xs text-gray-500 mt-1">
            This is your registered email address
          </p>
        </div>

        <div class="space-y-3">
          <Button
            type="submit"
            class="w-full"
          >
            Send Password Reset Link
          </Button>
          
          <Button 
            type="button"
            on:click={() => goto('/dashboard')} 
            variant="outline"
            class="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </form>

      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex">
          <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div class="ml-3">
            <p class="text-sm text-yellow-800">
              <strong>Security Notice:</strong> You will receive an email with a secure link to change your password. The link will expire in 1 hour.
            </p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</div>
