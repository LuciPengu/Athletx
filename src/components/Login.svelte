<script>
  import { onMount } from 'svelte';
  import { auth } from '../lib/firebase/firebase.config';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
      goto("/")
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  let email = '';
  let password = '';

  onMount(() => {
    email = '';
    password = '';
  });

  const handleLogin = async () => {
    await login(email, password);
  };
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
  <label>
    Email:
    <input type="email" bind:value={email} />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} />
  </label>
  <button type="submit">Login</button>
</form>