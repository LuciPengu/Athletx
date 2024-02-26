<script>
  import { onMount } from 'svelte';
  import { auth } from '../lib/firebase/firebase.config';
  import { createUserWithEmailAndPassword } from 'firebase/auth';

  let email = '';
  let password = '';
  let error = null;

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      goto("/")
      console.log('User registered successfully!');
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };
  
  const handleSignup = async () => {
    try {
      await signup(email, password);
      email = '';
      password = '';
      error = null;
    } catch (error) {
      console.error('Signup error:', error.message);
      error = error.message;
    }
  };

  onMount(() => {
    email = '';
    password = '';
    error = null;
  });
</script>

<style>
  .error {
    color: red;
  }
</style>

<form on:submit|preventDefault={handleSignup}>
  <h1>Signup</h1>
  <label>
    Email:
    <input type="email" bind:value={email} />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} />
  </label>
  <button type="submit">Sign Up</button>
  {#if error}
    <p class="error">{error}</p>
  {/if}
</form>
