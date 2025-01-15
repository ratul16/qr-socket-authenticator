<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProgressBar from 'primevue/progressbar'
import VueQrcode from 'vue-qrcode'

const text = ref('text-to-encode')

const TOTAL_TIME = 45 // 2 minutes in seconds
const timeLeft = ref(TOTAL_TIME)
const progress = ref(100)
const authCode = ref(456874)
let intervalId = null

const startTimer = () => {
  timeLeft.value = TOTAL_TIME
  progress.value = 100

  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      progress.value = (timeLeft.value / TOTAL_TIME) * 100
    } else {
      // Reset timer when it reaches 0
      timeLeft.value = TOTAL_TIME
      progress.value = 100
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="image-section"></div>
      <div class="login-content">
        <h1 class="title">Welcome !</h1>
        <p class="subtitle">Scan this QR code in-app to sign.</p>
        <div class="qr-code">
          <vue-qrcode
            version="4"
            scale="4"
            maskPattern="5"
            type="image/webp"
            quality="1"
            :value="text"
          />
        </div>
        <p>Or enter this code:</p>
        <div class="auth-code text-6xl font-bold">{{ authCode }}</div>
        <div class="timer-container">
          {{ formatTime(timeLeft) }}
          <ProgressBar :value="progress" :show-value="false" style="height: 6px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  min-height: 100vh;
  display: flex;
  width: 100%;
  /* max-width: 1200px; */
  background: #fff;
  /* border-radius: 1rem; */
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-content {
  flex: 1;
  padding: 2rem;
  background-color: #2b2d42;
  color: white;

  .qr-code {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    border-radius: 1rem;
    overflow: hidden;
    background-color: white;
  }
}

.image-section {
  flex: 2;
  background-image: url('https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?q=80&w=2049&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  min-height: 600px;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  height: 40px;
  margin-right: 1rem;
}

.company-name {
  font-size: 1.2rem;
  color: #8d99ae;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  color: #8d99ae;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .image-section {
    min-height: 300px;
  }

  .login-content {
    padding: 2rem;
  }
}
</style>
