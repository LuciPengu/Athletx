<script>
  import { onMount } from 'svelte';
  import { ref, get, child } from "firebase/database";
  import { db } from "../lib/firebase/firebase.config";
  import Searchbar from "../components/Searchbar.svelte";
  import ViewPost from '../components/ViewPost.svelte';
  import { fade } from 'svelte/transition';
  
  let recentPosts = [];

  onMount(async () => {
    const usersRef = ref(db, 'accounts'); // Assuming you have an 'accounts' node with usernames

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = Object.keys(snapshot.val());
        console.log(users);
        for (let i in users) {
          get(child(ref(db), `posts/${users[i]}`)).then((snapshot) => {
            if (snapshot.exists()) {
              let userPosts = Object.values(snapshot.val());
              recentPosts = [...recentPosts, ...userPosts]
            } else {
              console.log("No data available");
            }
          });
        }
        recentPosts = recentPosts.sort((a, b) => a.createdAt - b.createdAt);

        console.log(recentPosts, recentPosts.length);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  });
</script>

<div class="homeContainer" transition:fade={{ delay: 250, duration: 300 }}>
  <Searchbar />
  {#if recentPosts.length > 0}
    <div class="recentPosts">
      {#each recentPosts as post}
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
  {:else}
    <p>No recent posts to show.</p>
  {/if}
</div>


<style>
  .homeContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
  }

  .recentPosts {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

</style>

