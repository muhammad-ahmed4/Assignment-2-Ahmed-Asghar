<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';

  let context = 'registration'; // 'registration' or 'password-change'
  let email = '';
  let loading = false;
  let message = '';
  let error = '';
  let emailSent = false;

  onMount(() => {
    // Get context and email from URL params
    context = $page.url.searchParams.get('context') || 'registration';
    email = $page.url.searchParams.get('email') || '';
    emailSent = $page.url.searchParams.get('sent') === 'true';
    
    if (emailSent) {
      message = context === 'password-change' 
        ? 'Password reset email sent successfully!'
        : 'Verification email sent successfully!';
    }
  });

  async function resendVerification() {
    if (!email) {
      error = 'Email address not found';
      return;
    }

    loading = true;
    error = '';
    message = '';

    try {
      const endpoint = context === 'password-change' 
        ? '/api/auth/forgot-password' 
        : '/api/auth/resend-verification';

      const response = await fetch(endpoint, {
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
        error = data.error || 'Failed to resend email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Resend email error:', err);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    if (context === 'password-change') {
      goto('/dashboard');
    } else {
      goto('/register');
    }
  }
</script>

<svelte:head>
  <title>Check Your Email - ShieldAuth</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center">
        <div class="mb-6">
          <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          
          <p class="text-gray-600">
            {#if context === 'password-change'}
              We've sent a password reset link to your email address.
            {:else}
              We've sent a verification link to your email address.
            {/if}
          </p>
        </div>

        {#if email}
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Email sent to:</strong> {email}
            </p>
          </div>
        {/if}

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
        {/if}

        {#if error}
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
        {/if}

        <div class="space-y-3">
          <Button 
            on:click={resendVerification} 
            disabled={loading || !email}
            class="w-full"
          >
            {loading ? 'Sending...' : 'Resend Email'}
          </Button>
          
          <Button 
            on:click={goBack} 
            variant="outline"
            class="w-full"
          >
            {context === 'password-change' ? 'Back to Dashboard' : 'Back to Sign Up'}
          </Button>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            {#if context === 'password-change'}
              Didn't receive the email? Check your spam folder or try again.
            {:else}
              Didn't receive the email? Check your spam folder or try again.
            {/if}
          </p>
        </div>
      </div>
    </Card>
  </div>
</div>
