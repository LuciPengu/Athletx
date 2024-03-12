<script>
	import './styles.css';

  import Logout from '../components/Logout.svelte';
  import Navbar from "../components/Navbar.svelte";
  import Login from "../components/Login.svelte";
  
  import { auth } from '../lib/firebase/firebase.config';
  import { afterUpdate } from 'svelte';

  let user = null;

  afterUpdate(() => {
    user = auth.currentUser;
  });
  
</script>

<div class="app">

	<main>
    {#if user}
      <slot />
      <Navbar/>
    {:else}
      <Login/>
    {/if}
	</main>

</div>
