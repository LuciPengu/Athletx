<script>
  import { db, storage, auth } from '../../lib/firebase/firebase.config.js';
  import { ref, set } from 'firebase/database';
  import { getStorage, ref as red, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { goto } from '$app/navigation';

  let postText = '';
  let uploadedImage = null;
  let imageFile = null;
  let username = auth.currentUser.email.split("@")[0];

  function handleFileChange(event) {
    const file = event.target.files[0];
    imageFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function postToFirebase() {
    
    if (imageFile && postText.trim() !== '') {
      const imageRef = red(storage, `images/${imageFile.name}`);
      uploadBytes(imageRef, imageFile).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        const postRef = ref(db, `posts/${username}/${imageFile.name.split(".")[0]}`);
        await set(postRef, {
          text: postText,
          imageUrl: downloadURL,
          author: username,
          createdAt: Date.now(),
          likes: [username],
          likesCount: 0,
        }).then(() => {
          alert('Post uploaded successfully!');
          postText = '';
          uploadedImage = null;
          goto("/Profile");

        }).catch((error) => {
          console.error("Error uploading post: ", error);
          alert('Failed to upload post.');
        });
      }).catch((error) => {
        console.error("Error uploading image: ", error);
        alert('Failed to upload image.');
      });
    } else {
      alert('Please add both an image and some text to your post.');
    }
  }
</script>


<div class="postContainer">
  <textarea bind:value={postText} placeholder="What's on your mind?"></textarea>
  <input type="file" accept="image/*" on:change={handleFileChange}>
  {#if uploadedImage}
    <img class="image-preview" src={uploadedImage} alt="Preview">
  {/if}
  <button on:click={postToFirebase}>Post</button>

</div>


<style>
  .postContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
  }
  .image-preview {
    margin-top: 20px;
    max-height: 300px;
  }
</style>