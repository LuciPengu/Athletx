<script>
  import { auth, db } from "../lib/firebase/firebase.config";
  import { ref, get, set, child } from "firebase/database";
  import { fade } from 'svelte/transition';
  
  export let data = { imageUrl: "", text: "" , createdAt: 0, author: "", likesCount: 0, likes: "", comments: [] };
  let showModal = false;
  console.log(data.comments);
  let date = new Date(data.createdAt);
  let likesCount = data.likesCount;
  let comments = data.comments;
  
  let liked = data.likes.includes(auth.currentUser.email.split("@")[0]);
  
  function toggleModal() {
    showModal = !showModal;
  }

  const dbRef = ref(db);

  async function likePost() {

      const myUsername = auth.currentUser.email.split("@")[0];

      if (!myUsername) {
          console.error("Invalid operation.");
          return;
      }

      try {
          const targetUserSnapshot = await get(child(dbRef, `posts/${data.author}`));
          if (!targetUserSnapshot.exists()) {
              console.log("Target user does not exist.");
              return;
          }

          const targetPostsData = targetUserSnapshot.val();

          let targetPostId;
          for (let postId in targetPostsData) {
              if (targetPostsData[postId].createdAt == data.createdAt) {
                  targetPostId = postId;
                  break;
              }
          }

          if (targetPostId) {
              const targetPost = targetPostsData[targetPostId];

              if (!targetPost.likes || !targetPost.likes.includes(myUsername)) {
                  const updatedLikesCount = (targetPost.likesCount || 0) + 1;
                  const updatedLikes = targetPost.likes ? [...targetPost.likes, myUsername] : [myUsername];

                  await set(ref(db, `posts/${data.author}/${targetPostId}`), {
                      ...targetPost,
                      likes: updatedLikes,
                      likesCount: updatedLikesCount
                  });
                
                  likesCount += 1;
                  liked = true;
                
                  console.log('Post liked successfully!');
              } else {
                  console.log('Post already liked by the user.');
              }
          } else {
              console.log('Post not found.');
          }

      } catch (error) {
          console.error('Error during like operation:', error.message);
      }
  }

  let commentText = ""; // For binding to the comment input field

  // Function to submit a comment
  async function submitComment() {
    const myUsername = auth.currentUser.email.split("@")[0];
    if (!myUsername || !commentText.trim()) {
      console.error("Invalid operation or empty comment.");
      return;
    }

    try {
      const targetUserSnapshot = await get(child(dbRef, `posts/${data.author}`));
      if (!targetUserSnapshot.exists()) {
        console.log("Target user does not exist.");
        return;
      }

      const targetPostsData = targetUserSnapshot.val();
      let targetPostId;
      for (let postId in targetPostsData) {
        if (targetPostsData[postId].createdAt == data.createdAt) {
          targetPostId = postId;
          break;
        }
      }

      if (targetPostId) {
        const targetPost = targetPostsData[targetPostId];
        const updatedComments = targetPost.comments ? [...targetPost.comments, { username: myUsername, comment: commentText, timestamp: Date.now() }] : [{ username: myUsername, comment: commentText, timestamp: Date.now() }];
        
        await set(ref(db, `posts/${data.author}/${targetPostId}`), {
          ...targetPost,
          comments: updatedComments
        });

        comments = updatedComments;
        commentText = ""; // Clear comment input
        console.log('Comment added successfully!');
      } else {
        console.log('Post not found.');
      }
    } catch (error) {
      console.error('Error during comment operation:', error.message);
    }
  }


</script>

<div class="post" on:click={toggleModal}>
  <img src={data.imageUrl} alt="Post image" />
  <p><b>@{data.author}</b> {data.text} <span style="float:right">❤️ {likesCount}</span></p>
  <hr/>
</div>

{#if showModal}
  <div transition:fade={{ delay: 100, duration: 200 }} class="modal" on:click={toggleModal}>
    <div class="modal-content" on:click|stopPropagation>
      <button class="close-btn" on:click={toggleModal}>×</button>
      <img src={data.imageUrl} alt="Descriptive text"/>
      <p>
      <span style="float:left">
      
      {date.toLocaleDateString()} 
      
      </span>
      <span>
        <b>@{data.author}</b> {data.text}
      </span>
      <span style="float:right">{#if liked}❤️{:else}<button class="likeButton" on:click={() => likePost()}>🖤</button>{/if} {likesCount}</span>
      </p>
      
      
      <div class="comments-container">
        {#if comments && comments.length > 0}
          <div class="comments">
            {#each comments as comment}
              <p><b>@{comment.username}</b>: {comment.comment}</p>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Inside your modal, after the like button and likes count -->
      <textarea bind:value={commentText} placeholder="Write a comment..."></textarea>
      <button on:click={submitComment}>Submit Comment</button>

    </div>
  </div>
{/if}

<style>
  .comments-container {
    max-height: 5em; /* Adjust based on your preference */
    overflow-y: auto; /* Enables vertical scrolling */
    margin-top: 1em;
    border-radius: 4px; /* Optional, for styling */
    border: 1px solid #ccc; /* Optional, for styling */
    padding: 0.5em; /* Optional, for styling */
    
  }

  hr {
    border: none;
    height: 1px;
    /* Set the hr color */
    color: #333;  /* old IE */
    background-color: #333;  /* Modern Browsers */
  }

  /* Additional styles for the textarea and the submit button */
  textarea {
    width: 100%;
    margin-top: 1em;
    padding: 0.5em;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical; /* Allows the user to resize the textarea vertically */
  }

  button {
    margin-top: 1em;
    padding: 0.5em 1em;
    background-color: purple;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .likeButton {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
  }


  button:hover {
    background-color: darkpurple; /* Adjust the color as needed */
  }

  .post img {
    width: 100%; /* Adjust based on your layout */
    max-width: 600px; /* Adjust based on your layout */
    height: 20em;
    width: 20em;
    border-radius: 8px;
    object-fit: cover;
  }

  .post p {
    margin-top: 0.5em;
  }

  .post {
    padding: 0.5em;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;

  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
  }

  img {
    max-width: 50em;
    height: auto;
    border-radius: 5px;
    max-height: 30em;

  }

  p {
    margin-top: 10px;
  }
</style>
