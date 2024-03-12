<script>
  import { auth, db } from "../../lib/firebase/firebase.config";
  import { ref, get, child } from "firebase/database";

  const dbRef = ref(db);
  let username = auth.currentUser.email.split("@")[0];
  let followers = 0;
  let following = 0;

  get(child(dbRef, "accounts/"+username)).then((snapshot) => {
    if (snapshot.exists()) {
      followers = snapshot.val().followers;
      following = snapshot.val().following;
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  });

</script>

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

  .user-icon {
    width: 80px;
    height: 80px;
    background-color: #ddd;
    border-radius: 50%;
    margin-bottom: 0.5em;
  }

</style>

<div class="profileContainer">
  <h1>Hello, {username.charAt(0).toUpperCase() + username.slice(1)}!</h1>
  <div class="user-info">
    <div class="user-icon"></div>
    <div>{username}</div>
    <div>
      Followers: {followers}
      Following: {following}
    </div>
  </div>
</div>
