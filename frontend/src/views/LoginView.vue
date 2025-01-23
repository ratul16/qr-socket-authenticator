<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { io } from 'socket.io-client'

import Message from 'primevue/message'
import VueQrcode from 'vue-qrcode'
import OverlayBadge from 'primevue/overlaybadge'

// Constants
const serverUrl = 'http://localhost:443'
const router = useRouter()
const socket = io(serverUrl)
const TIMER_DURATION = 45

// Refs
const isConnected = ref(false)
const appId = ref(null)
const timeLeft = ref(TIMER_DURATION)
const progress = ref(100)
const refreshInterval = ref(null)
const message = ref(null)

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

// Refresh App Registration
const refreshAppRegistration = () => {
  try {
    socket.removeAllListeners()
    socket.disconnect()
    socket.connect()
    setupSocketListeners()
    registerApp()
    resetTimer()
    message.value = null
    console.log('App registration refreshed')
  } catch (error) {
    console.error('Failed to refresh app registration:', error)
    setTimeout(refreshAppRegistration, 5000)
  }
}

const users = [
  {
    name: 'John Anderson',
    email: 'john.admin@test.com',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.manager@test.com',
    password: 'Manager456!',
    role: 'manager',
  },
  {
    name: 'David Wilson',
    email: 'david.user@test.com',
    password: 'User789!',
    role: 'user',
  },
]
// Login Function
const login = async (email, password) => {
  try {
    const user = users.find((user) => user.email === email && user.password === password)

    if (user) {
      loginMessage({
        status: true,
        message: `Welcome ${user.name}, you are logged in as ${user.role}`,
      })
      message.value = {
        status: true,
        message: `Welcome ${user.name}, you are logged in as ${user.role}`,
      }
    } else {
      loginMessage({
        status: false,
        message: 'Invalid email or password',
      })
      message.value = {
        status: false,
        message: 'Invalid email or password',
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    loginMessage({
      status: false,
      message: 'Login failed. Please try again.',
    })
    message.value = {
      status: false,
      message: 'Login failed. Please try again.',
    }
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) return `${remainingSeconds}s`
  if (remainingSeconds === 0) return `${minutes} min`

  return `${minutes} min ${remainingSeconds}s`
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
          <OverlayBadge size="large" :value="formatTime(timeLeft)" severity="primary">
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
          </OverlayBadge>

          <!-- Manual Code Section -->
          <div class="manual-code-section">
            <p class="manual-code-label">Or enter this code in the below link:</p>
            <a :href="`http://localhost:5174/${appId}`" target="_blank" class="mt-3"
              >http://localhost:5174/{{ appId }}</a
            >
            <div class="auth-code text-6xl font-bold">{{ appId }}</div>
          </div>
          <Message v-if="message" :severity="message.status ? 'success' : 'danger'">
            {{ message.message }}
          </Message>
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
  position: relative;
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
  gap: 1rem;
}
.qr-code {
  width: 190px;
  height: 190px;
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

.reset-timer {
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

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.subtitle {
  color: #8d99ae;
}

:deep(.p-overlaybadge .p-badge) {
  width: 40px;
  height: 40px;
  font-size: 1rem;
  border-radius: 50%;
  background-color: white;
  outline-style: none;
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .title {
    font-size: 2rem;
    margin: 0;
  }

  .image-section {
    min-height: 250px;
  }

  .login-content {
    padding: 2rem;
  }
}
</style>
