<script>
  import { auth, db } from "../../lib/firebase/firebase.config";
  import { ref, get, set, child } from "firebase/database";
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  import ViewPost from '../../components/ViewPost.svelte';

  let username = $page.url.searchParams.get('p');

  let followers = 0;
  let following = 0;
  let isFollowing = false;
  let userPosts = [];

  const dbRef = ref(db);

  onMount(() => {
    getUserInfo();
    getUserPosts();
  });

  function getUserInfo() {
    const myUsername = auth.currentUser.email.split("@")[0];

    get(child(dbRef, `accounts/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        followers = snapshot.val().followers.length;
        following = snapshot.val().following.length;
        isFollowing = snapshot.val().followers.includes(myUsername);
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }

  function getUserPosts() {
    get(child(dbRef, `posts/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        userPosts = Object.values(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }

  async function followUser(username) {
    // Assuming 'auth', 'dbRef', and 'db' are predefined in your context.
    const myUsername = auth.currentUser.email.split("@")[0];
    if (!username || username === myUsername) {
      console.error("Invalid operation.");
      return;
    }

    try {
      // Retrieve the target user's account details
      const targetUserSnapshot = await get(child(dbRef, `accounts/${username}`));
      if (!targetUserSnapshot.exists()) {
        console.log("Target user does not exist.");
        return;
      }

      const targetUserData = targetUserSnapshot.val();
      if (!targetUserData.followers.includes(myUsername)) {
        // Update the target user's followers list
        await set(ref(db, `accounts/${username}`), {
          ...targetUserData,
          followers: [...targetUserData.followers, myUsername],
        });
        isFollowing = true;
        followers += 1;
        console.log('User followed successfully!');
        
      }

      // Retrieve the current user's account details
      const myUserSnapshot = await get(child(dbRef, `accounts/${myUsername}`));
      if (!myUserSnapshot.exists()) {
        console.log("Your user account does not exist.");
        return;
      }

      const myUserData = myUserSnapshot.val();
      if (!myUserData.following.includes(username)) {
        // Update the current user's following list
        await set(ref(db, `accounts/${myUsername}`), {
          ...myUserData,
          following: [...myUserData.following, username],
        });
        console.log('Following user successfully!');
      }

    } catch (error) {
      console.error('Error during follow operation:', error.message);
    }
  }

</script>

<div class="profileContainer" >
  <h1>{username.charAt(0).toUpperCase() + username.slice(1)}'s Profile</h1>
  
  <div class="user-info">
    <div>@{username}</div>
    <div>
      Followers: {followers}
      Following: {following}
    </div>
    
    <p>not ur profile</p>
    {#if !isFollowing}
      <button on:click={() => followUser(username)}>Follow</button>
    {/if}
    {#if userPosts.length > 0}
      <div class="postsContainer">
        <div class="posts" >
          {#each userPosts as post}
            <ViewPost data={{"imageUrl":post.imageUrl,
             "text":post.text,
             "createdAt":post.createdAt,
             "author":post.author,
             "likesCount":post.likesCount,
             "likes":post.likes,
             "comments":post.comments
            }} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .profileContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
  }

  h1 {
    font-size: 24px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
  }

  .postsContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1em;
    max-width: 100%; 
  }

  .posts {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;

  }

</style>