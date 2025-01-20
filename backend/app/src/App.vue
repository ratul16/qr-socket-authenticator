<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputOtp from 'primevue/inputotp'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Badge from 'primevue/badge'

const serverUrl = 'http://localhost:443'
const route = useRoute()
const router = useRouter()
const socket = io(serverUrl)
const isConnected = ref(false)
const tvId = ref(null)
const isTvConnected = ref(false)
const connectTvCode = ref(0)
const email = ref('')
const password = ref('')
const loginSuccess = ref(false)
const showMessage = ref(false)
const errorMessage = ref('')
const passwordVisible = ref(false)
const loginStatus = ref({
  status: false,
  message: '',
})

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const connectToTV = (id) => {
  socket.emit('connect-to-tv', id)
  tvId.value = id
}

const sendCredentials = () => {
  const credentials = { email: email.value, password: password.value }
  if (tvId.value) {
    socket.emit('send-credentials', credentials)
  } else {
    console.log('TV ID is missing.')
  }
}

const getTvParams = async () => {
  const id = route.params.id
  if (id && id.length === 6) {
    console.log('Connecting to TV with ID:', id)
    connectToTV(id)
    connectTvCode.value = id
  }
}

const resetConnection = () => {
  // socket.disconnect()

  // Reset relevant app states
  isTvConnected.value = false
  tvId.value = null
  email.value = ''
  password.value = ''
  connectTvCode.value = 0
  loginSuccess.value = false
  showMessage.value = false

  console.log('App reset, waiting for new TV connection...')

  // If the route has an 'id' parameter, redirect to '/'
  if (route.params.id) {
    router.push('/')
    console.log('Route has an ID, redirecting to /')
  }

  // socket.connect()
}

// Watch for changes in the OTP (connectTvCode)
watch(connectTvCode, (newCode) => {
  if (newCode.length === 6) {
    console.log('Connecting to TV ID:', newCode)
    connectToTV(newCode)
  }
})

onMounted(() => {
  resetConnection()
  getTvParams()

  socket.on('connect', () => {
    isConnected.value = true
    console.log('Connected to server', socket.connected)
    console.log('Client Socket Id:', socket.id)
  })

  socket.on('disconnect', () => {
    isConnected.value = false
    isTvConnected.value = false // Reset TV connection state
    console.log('Disconnected from server')
  })

  socket.on('tv-registered', (id) => {
    tvId.value = id
    console.log(`Received TV ID: ${id}`)
  })

  socket.on('connected-to-tv', (success) => {
    isTvConnected.value = success
    console.log('TV connection successful:', success)
  })

  socket.on('login-result-client', (result) => {
    console.log('Login result received in login app:', result)
    loginStatus.value = result
    loginSuccess.value = result.status

    if (!result.status) {
      showMessage.value = true
      email.value = ''
      password.value = ''
      errorMessage.value = result.message
      setTimeout(() => {
        showMessage.value = false
      }, 5000)
    }
  })

  socket.on('simple-test', (message) => {
    console.log('Simple test message received in login app:', message) // This should log the message
  })
})

onUnmounted(() => {
  socket.off('connect')
  socket.off('disconnect')
  socket.off('tv-registered')
  socket.off('connected-to-tv')
  socket.off('login-result')
  socket.disconnect()
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="image-section" />
      <div class="login-content">
        <header>
          <h1 class="title">Log in to App</h1>
          <Badge
            class="capitalize"
            :value="isTvConnected ? 'App Connected' : 'App Not Connected'"
            :severity="isTvConnected ? 'success' : 'danger'"
          />
        </header>

        <div class="opt-section grid">
          <div class="col-12">
            <label for="otp">Enter the 6 digit code to connect</label>
            <InputOtp
              id="otp"
              v-model="connectTvCode"
              :length="6"
              :disabled="isTvConnected && connectTvCode"
              integerOnly
              class="w-full"
            />
          </div>
        </div>

        <div class="auth-section grid">
          <div class="col-12">
            <label for="username">Email</label>
            <InputText id="username" class="w-full" v-model="email" :disabled="!isTvConnected" />
          </div>
          <div class="col-12">
            <label for="password">Password</label>
            <InputGroup>
              <InputText
                id="password"
                class="w-full"
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                :disabled="!isTvConnected"
              />
              <InputGroupAddon @click="togglePasswordVisibility">
                <i class="pi" :class="!passwordVisible ? 'pi-eye-slash' : 'pi-eye'" />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="col-12">
            <Button class="w-full mt-3" label="Submit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
}

.login-card {
  width: 100%;
  display: flex;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 2;
  background-image: url('https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?q=80&w=2049&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
}

.login-content {
  flex: 1;
  padding: 3rem;
  background-color: #2b2d42;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.title {
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

:deep(.p-inputotp) {
  justify-content: space-between;
}

:deep(.p-inputotp .p-inputotp-input) {
  width: calc(16.66% - 0.1rem);
  height: 3.6rem;
  font-size: 1.25rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    background-image: url('https://images.unsplash.com/39/wdXqHcTwSTmLuKOGz92L_Landscape.jpg?q=80&w=2049&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    align-items: center;
    justify-content: center;
  }

  .login-card {
    max-width: 400px;
    margin: auto;
    background-color: transparent;
  }

  .image-section {
    display: none;
  }

  :deep(.p-inputotp .p-inputotp-input) {
    width: calc(16.66% - 0.1rem);
    height: 3rem;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .login-content {
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
  }
}
</style>
