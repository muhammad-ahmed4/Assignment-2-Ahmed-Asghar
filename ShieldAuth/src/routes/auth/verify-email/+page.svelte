<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';

  let loading = false;
  let message = '';
  let error = '';
  let token = '';

  onMount(() => {
    token = $page.url.searchParams.get('token') || '';
    if (token) {
      verifyEmail();
    } else {
      error = 'No verification token provided';
    }
  });

  async function verifyEmail() {
    if (!token) return;
    
    loading = true;
    error = '';
    message = '';

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        message = data.message;
        // Show success and redirect to appropriate page
        setTimeout(() => {
          const context = $page.url.searchParams.get('context') || 'registration';
          if (context === 'password-change') {
            goto('/auth/reset-password?token=' + token);
          } else {
            goto('/login?verified=true');
          }
        }, 2000);
      } else {
        error = data.error || 'Verification failed';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Verification error:', err);
    } finally {
      loading = false;
    }
  }

  async function resendVerification() {
    loading = true;
    error = '';
    message = '';

    try {
      const email = prompt('Please enter your email address:');
      if (!email) {
        loading = false;
        return;
      }

      const response = await fetch('/api/auth/resend-verification', {
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
        error = data.error || 'Failed to resend verification email';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      console.error('Resend verification error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Verify Email - ShieldAuth</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <Card>
      <div class="text-center">
        <div class="mb-6">
          <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {#if loading}
              <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            {:else if message}
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            {:else if error}
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            {:else}
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            {/if}
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            {#if loading}
              Verifying Email...
            {:else if message}
              Email Verified!
            {:else if error}
              Verification Failed
            {:else}
              Email Verification
            {/if}
          </h1>
        </div>

        {#if message}
          <div class="mb-6">
            <p class="text-green-600 font-medium">{message}</p>
            <p class="text-gray-600 text-sm mt-2">Redirecting to login page...</p>
          </div>
        {:else if error}
          <div class="mb-6">
            <p class="text-red-600 font-medium">{error}</p>
            <p class="text-gray-600 text-sm mt-2">
              The verification link may have expired or is invalid.
            </p>
          </div>
          
          <div class="space-y-3">
            <Button 
              on:click={resendVerification} 
              disabled={loading}
              class="w-full"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            
            <Button 
              on:click={() => goto('/login')} 
              variant="outline"
              class="w-full"
            >
              Back to Login
            </Button>
          </div>
        {:else}
          <div class="mb-6">
            <p class="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        {/if}
      </div>
    </Card>
  </div>
</div>
