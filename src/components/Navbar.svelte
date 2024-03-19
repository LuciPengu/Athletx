<div class="navbar">
  <a href="/Profile">Profile</a>
  <a href="/">Home</a>
  <a href="/">Settings</a>
</div>

<style>
  .navbar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 1em 0;
    margin: 0;
  }

  .navbar a {
    display: inline-block;
    background-color: #ccc;
    border-radius: 8px;
    padding: 14px 16px;
  }

  .navbar a:focus {     
    background-color:yellow;    
  }

</style>