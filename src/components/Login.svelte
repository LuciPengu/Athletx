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
  <h1>ATHLETE X</h1>
  {#if toggle}

    <h2>Login</h2>
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
    <h2>Signup</h2>
    <form on:submit|preventDefault={handleSignup}>
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

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }

  form {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    padding: 20px;
    width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  label {
    display: block;
    margin-bottom: 15px;
    color: #fff;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.8);
  }

  button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    background: #ff1111;
    color: white;
    font-size: 1em;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background: #aa5555;
  }

  a {
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
    text-decoration: underline;
  }

  .error {
    margin-top: 10px;
    color: red;
  }

      
</style>