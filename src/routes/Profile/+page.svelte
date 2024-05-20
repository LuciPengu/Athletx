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
        <div class="posts">
          {#each userPosts as post}
            <ViewPost data={{
              "imageUrl":post.imageUrl,
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
    padding: 1em;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 2em;
    color: #333;
    margin-bottom: 0.5em;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
    font-size: 1em;
    color: #555;
  }

  .user-info div {
    margin: 0.5em 0;
  }

  a {
    padding: 0.5em 1em;
    background: #ff1111;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s, transform 0.1s;
  }

  a:hover,
  a:focus {
    background-color: #aa5555;
    transform: scale(1.05);
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

  /* Style individual posts */
  .post {
    background-color: white;
    padding: 1em;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: calc(100% / 3 - 2em); /* Adjust width based on how many posts you want per row */
    max-width: 300px; /* Ensure it doesn't get too wide */
  }

  .post img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 0.5em;
  }

  .post p {
    font-size: 0.9em;
    color: #333;
  }

  .post h2 {
    font-size: 1.2em;
    margin-bottom: 0.5em;
    color: #007bff;
  }

  .post:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
</style>
