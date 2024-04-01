<div class="navbar">
  <a href="/Profile">Profile</a>
  <a href="/">Home</a>
  <a href="/">Settings</a>
</div>



<style>
  /*
  flex box grid layout
  left right = back and forth
  up is like
  down is (negative option)
  
  */
  .navbar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 1em 0;
    margin: 0;
    background-color: #f0f0f0; /* Light grey background */
    box-shadow: 0 -2px 5px rgba(0,0,0,0.1); /* Adds shadow to the top of the navbar */
  }

  .navbar a {
    display: inline-block;
    background-color: #007bff; /* Bootstrap primary blue */
    color: white; /* White text */
    border-radius: 8px;
    padding: 14px 16px;
    text-decoration: none; /* Removes underline from links */
    transition: background-color 0.3s, transform 0.1s; /* Smooth background color change and subtle grow effect */
  }

  .navbar a:hover, .navbar a:focus {
    background-color: #0056b3; /* A darker shade of blue for hover/focus */
    color: #ffffff; /* Ensures text color remains white */
    transform: scale(1.05); /* Slightly enlarges the link on hover/focus for a pop effect */
  }

  .navbar a:not(:last-child) {
    margin-right: 4px; /* Adds space between the links */
  }

</style>
