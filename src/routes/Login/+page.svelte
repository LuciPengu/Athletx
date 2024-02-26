<script>
  import Login from '../../components/Login.svelte';
  import Signup from '../../components/Signup.svelte';
  import Logout from '../../components/Logout.svelte';
  
  let toggle = true;

  function toggleLogin() {
    toggle = !toggle;
  }
</script>

<main>

<div class="LoginSignupForm">
  {#if toggle}
    <Login/>

  {:else}
    <Signup/>
  {/if}
    <a on:click={toggleLogin}>{ toggle ? "Signup" : "Login" }</a>
  </div>
  
</main>

<style>

  .LoginSignupForm{
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto;
    padding: 1em;
    background-color: #f2f2f2;
  }


</style>