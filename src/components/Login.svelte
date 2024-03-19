<script>
  import { onMount } from 'svelte';
  import { auth, db } from '../lib/firebase/firebase.config';
  import { ref, set } from "firebase/database";
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';

  let toggle = true;

  function toggleLogin() {
    toggle = !toggle;
  }

  let email = '';
  let password = '';
  let error = null;

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
      goto("/")
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      let username = email.split("@")[0];
      await set(ref(db, 'accounts/'+ username), {
        username: username,
        followers: [username],
        following: [username],
      })
      goto("/")
      console.log('User registered successfully!');
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const handleLogin = async () => {
    await login(email, password);
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

<main>

  {#if toggle}

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

  {:else}

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

  {/if}
  <a on:click={toggleLogin}>{ toggle ? "Signup" : "Login" }</a>

</main>
