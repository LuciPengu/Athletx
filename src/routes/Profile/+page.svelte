<script>
  import { auth, db } from "../../lib/firebase/firebase.config";
  import { ref, get, child } from "firebase/database";
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ViewPost from '../../components/ViewPost.svelte';
  
  let username = auth.currentUser.email.split("@")[0];
  
  let followers = 0;
  let following = 0;
  let userPosts = [];

  const dbRef = ref(db);
  
  onMount(() => {
    
    getUserInfo();
    getUserPosts();
  });

  function getUserInfo() {
    get(child(dbRef, `accounts/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        followers = snapshot.val().followers.length;
        following = snapshot.val().following.length;
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
</script>

<div class="profileContainer">
  <h1>Hello, {username.charAt(0).toUpperCase() + username.slice(1)}!</h1>
  <div class="user-info">
    <div>@{username}</div>
    <div>
      Followers: {followers}
      Following: {following}
    </div>
    <a href="/CreatePost">Create Post</a>
    {#if userPosts.length > 0}
      <div class="postsContainer">
        <div class="posts" >
>
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
    gap: 1em; /* Adjust gap as necessary */
    max-width: 100%; /* Adjust max width as necessary */
  }
  
  .posts {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;

  }

</style>