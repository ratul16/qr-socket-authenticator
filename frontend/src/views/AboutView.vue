<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'

const authStore = useAuthStore()
const user = ref({})
const router = useRouter()

const returnHome = () => {
  router.push('/')
}

onMounted(() => {
  user.value = authStore.getUser
})
</script>

<template>
  <div class="profile">
    <div class="profile-content shadow-8">
      <img
        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
        alt="Profile Picture"
        class="profile-image shadow-6"
      />
      <h1 v-if="authStore.user" class="profile-title">{{ authStore.user.name || '' }}</h1>
      <h2 class="profile-title">About Me</h2>
      <p class="profile-description text-justify mb-4">
        I'm a software engineer with a passion for building products that make a difference. I have
        experience working with a variety of technologies, including JavaScript, Python, and SQL. In
        my free time, I enjoy hiking, reading, and playing the guitar.
      </p>
      <Button class="w-full" label="Go to Home" @click="returnHome" />
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
