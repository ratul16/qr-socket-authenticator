<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { io } from 'socket.io-client'
import { useToast } from 'primevue/usetoast'
import ProgressBar from 'primevue/progressbar'
import VueQrcode from 'vue-qrcode'

// Constants
const serverUrl = 'http://localhost:443'
const router = useRouter()
const socket = io(serverUrl)
const toast = useToast()
const TIMER_DURATION = 3000

// Refs
const isConnected = ref(false)
const appId = ref(null)
const timeLeft = ref(TIMER_DURATION)
const progress = ref(100)
const refreshInterval = ref(null)

// Socket event handlers
const registerApp = () => {
  socket.emit('register-app')
}

const loginMessage = (success) => {
  console.log('Login result:', success)
  socket.emit('login-result', success)
}

const setupSocketListeners = () => {
  socket.on('connect', () => {
    isConnected.value = true
    console.log('Connected to server', socket.connected)
  })

  socket.on('disconnect', () => {
    isConnected.value = false
    console.log('Disconnected from server')
  })

  socket.on('app-registered', (id) => {
    appId.value = id
    console.log(`Received App ID: ${id}`)
  })

  socket.on('receive-credentials', (credentials) => {
    console.log('Received credentials:', credentials)
    login(credentials.email, credentials.password)
  })
}

// Timer Functions
function resetTimer() {
  timeLeft.value = TIMER_DURATION
  progress.value = 100
}

const refreshAppRegistration = () => {
  try {
    socket.removeAllListeners()
    socket.disconnect()
    socket.connect()
    setupSocketListeners()
    registerApp()
    resetTimer()
    console.log('App registration refreshed')
  } catch (error) {
    console.error('Failed to refresh app registration:', error)
    setTimeout(refreshAppRegistration, 5000)
  }
}

const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5173/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      loginMessage({
        status: true,
        message: 'You are Logged In to the App',
      })
      toast.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: 'You have been logged in.',
        life: 3000,
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You do not have access to use this application. Please contact an administrator',
        life: 3000,
      })
      loginMessage({
        status: false,
        message: 'You do not have access to use this application. Please contact an administrator',
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    loginMessage({
      status: false,
      message: 'Login failed. Please check your email and password and try again.',
    })
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Login failed. Please check your email and password and try again.',
      life: 3000,
    })
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Lifecycle Hooks
onMounted(() => {
  setupSocketListeners()
  registerApp()

  refreshInterval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      progress.value = (timeLeft.value / TIMER_DURATION) * 100
    } else {
      refreshAppRegistration()
    }
  }, 1000)
})

onUnmounted(() => {
  socket.removeAllListeners()
  socket.disconnect()
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="image-section"></div>
      <div class="login-content">
        <header class="text-center">
          <h1 class="title">Welcome!</h1>
          <p class="subtitle">Scan this QR code in-app to sign in</p>
        </header>

        <div class="authentication-section">
          <!-- QR Code Section -->
          <div class="qr-code">
            <vue-qrcode
              :value="`http://localhost:5173/${appId}`"
              version="3"
              scale="5"
              maskPattern="3"
              type="image/webp"
              quality="1"
            />
          </div>

          <!-- Manual Code Section -->
          <div class="manual-code-section">
            <p class="manual-code-label">Or enter this code:</p>
            <div class="auth-code text-6xl font-bold">{{ appId }}</div>
            <!-- <div class="auth-code text-6xl font-bold">{{ authCode }}</div> -->
          </div>

          <!-- Timer Section -->
          <div class="timer-container">
            <span class="timer-text">{{ formatTime(timeLeft) }}</span>
            <ProgressBar :value="progress" :show-value="false" class="timer-bar" />
            <a :href="`http://localhost:5174/${appId}`" target="_blank" class="mt-3"
              >http://localhost:5174/{{ appId }}</a
            >
          </div>
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
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-content {
  flex: 1;
  padding: 3rem;
  background-color: #2b2d42;
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
}

.image-section {
  flex: 2;
  background-image: url('https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?q=80&w=2049&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  min-height: 600px;
}

.authentication-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.qr-code {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
}

.manual-code-section {
  text-align: center;
}

.manual-code-label {
  color: #8d99ae;
  margin-bottom: 0.5rem;
}

.timer-container {
  width: 100%;
  max-width: 300px;
  text-align: center;
}

.timer-text {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #8d99ae;
}

.timer-bar {
  height: 6px;
  border-radius: 3px;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  color: #8d99ae;
}

:deep(.p-progressbar) {
  background: rgba(141, 153, 174, 0.2);
}

:deep(.p-progressbar-value) {
  background: #8d99ae;
  transition: width 1s linear;
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
