<script></script>

<template>
  <div class="profile">
    <div class="profile-content shadow-8">
      <img
        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        alt="Profile Picture"
        class="profile-image shadow-6"
      />
      <h1 class="profile-title">About Me</h1>
      <p class="profile-description">
        I'm a software engineer with a passion for building products that make a difference. I have
        experience working with a variety of technologies, including JavaScript, Python, and SQL. In
        my free time, I enjoy hiking, reading, and playing the guitar.
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.profile {
  background-image: url('https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?q=80&w=2049&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-content {
  max-width: 500px;
  padding: 3rem;
  background-color: #2b2d42;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 1rem;

  img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    margin-bottom: 1rem;
  }
}
</style>
