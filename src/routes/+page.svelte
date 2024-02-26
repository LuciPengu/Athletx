<script>
  import { auth } from '../lib/firebase/firebase.config';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let user = null;

  onMount(() => {
    user = auth.currentUser;
    if (user == null){
      goto("/Login");
    }
  });


</script>

{#if user}
  <p>Welcome, {user.email}!</p>
{:else}
  <p>Logging Out</p>
{/if}
