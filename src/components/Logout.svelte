<script>
  import { auth } from '../lib/firebase/firebase.config';
  import { goto } from '$app/navigation';

  const logout = async () => {
    try {
      await auth.signOut();
      console.log('Logged out successfully!');
      goto("/")
    } catch (error) {
      console.error('Error logging out:', error.message);
      throw error;
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };
</script>

<h1>Logout</h1>
<button on:click={handleLogout}>Logout</button>