<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from 'socket.io-client'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InputOtp from 'primevue/inputotp'
import Message from 'primevue/message'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import Badge from 'primevue/badge'

// Constants
const SERVER_URL = 'http://localhost:443'
const CONNECTION_TIMEOUT = 5000

// Composables
const route = useRoute()
const router = useRouter()
const socket = io(SERVER_URL)

// State management using a single reactive object
const state = ref({
  connection: {
    isConnected: false,
    isAppConnected: false,
    appId: null,
    connectCode: '',
  },
  form: {
    email: '',
    password: '',
    passwordVisible: false,
  },
  auth: {
    success: false,
    showMessage: false,
    errorMessage: '',
    status: {
      status: false,
      message: '',
    },
  },
})

// Computed properties
const isFormValid = computed(() => {
  const { email, password } = state.value.form
  return email.trim() && password.trim() && state.value.connection.isAppConnected
})

const connectionStatus = computed(() => ({
  text: state.value.connection.isAppConnected ? 'App Connected' : 'App Not Connected',
  severity: state.value.connection.isAppConnected ? 'success' : 'danger',
}))

// Methods
const togglePasswordVisibility = () => {
  state.value.form.passwordVisible = !state.value.form.passwordVisible
}

const connectToApp = (id) => {
  if (!id || id.length !== 6) return

  socket.emit('connect-to-app', id)
  state.value.connection.appId = id
  console.log('Connecting to app:', id)
}

const sendCredentials = () => {
  const { email, password } = state.value.form
  const { appId } = state.value.connection

  if (!appId) {
    console.error('App ID is missing')
    return
  }

  socket.emit('send-credentials', { email, password })
}

const handleConnectionError = () => {
  state.value.connection.isAppConnected = false
  state.value.auth.showMessage = true
  state.value.auth.errorMessage = 'Connection failed. Please try again.'

  setTimeout(() => {
    state.value.auth.showMessage = false
  }, CONNECTION_TIMEOUT)
}

const resetState = () => {
  state.value = {
    connection: {
      isConnected: false,
      isAppConnected: false,
      appId: null,
      connectCode: '',
    },
    form: {
      email: '',
      password: '',
      passwordVisible: false,
    },
    auth: {
      success: false,
      showMessage: false,
      errorMessage: '',
      status: { status: false, message: '' },
    },
  }

  if (route.params.id) {
    router.push('/')
  }
}

// Socket event handlers
const setupSocketListeners = () => {
  socket.on('connect', () => {
    state.value.connection.isConnected = true
    console.log('Connected to server:', socket.id)
  })

  socket.on('disconnect', () => {
    state.value.connection.isConnected = false
    state.value.connection.isAppConnected = false
    console.log('Disconnected from server')
  })

  socket.on('connected-to-app', (success) => {
    state.value.connection.isAppConnected = success
    if (!success) handleConnectionError()
  })

  socket.on('login-result-client', (result) => {
    state.value.auth.status = result
    state.value.auth.success = result.status

    if (!result.status) {
      state.value.auth.showMessage = true
      state.value.form.email = ''
      state.value.form.password = ''
      state.value.auth.errorMessage = result.message

      setTimeout(() => {
        state.value.auth.showMessage = false
      }, CONNECTION_TIMEOUT)
    }
  })
}

// Initialize component
const initializeComponent = async () => {
  const id = route.params?.id
  console.log('Received ID:', id)

  if (id?.length === 6) {
    connectToApp(id)
    state.value.connection.connectCode = id
  }
}

// Watchers
watch(
  () => state.value.connection.connectCode,
  (newCode) => {
    if (newCode?.length === 6) {
      connectToApp(newCode)
    }
  },
)

// Lifecycle hooks
onMounted(() => {
  setupSocketListeners()
  initializeComponent()
})

onUnmounted(() => {
  socket.removeAllListeners()
  socket.disconnect()
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="image-section" />
      <div class="login-content">
        <header class="header-section">
          <h1 class="title">Log in to App</h1>
          <Badge
            class="capitalize"
            :value="connectionStatus.text"
            :severity="connectionStatus.severity"
          />
        </header>

        <div class="auth-form">
          <div class="otp-section">
            <label for="otp">Enter the 6 digit code to connect</label>
            <InputOtp
              id="otp"
              v-model="state.connection.connectCode"
              :length="6"
              :disabled="state.connection.isAppConnected"
              integerOnly
              class="w-full"
            />
          </div>

          <div class="credentials-section">
            <div class="form-group">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="state.form.email"
                :disabled="!state.connection.isAppConnected"
                class="w-full"
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <InputGroup>
                <InputText
                  id="password"
                  v-model="state.form.password"
                  :type="state.form.passwordVisible ? 'text' : 'password'"
                  :disabled="!state.connection.isAppConnected"
                  class="w-full"
                />
                <InputGroupAddon @click="togglePasswordVisibility">
                  <i class="pi" :class="state.form.passwordVisible ? 'pi-eye' : 'pi-eye-slash'" />
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Button
              class="w-full submit-button"
              label="Submit"
              :disabled="!isFormValid"
              @click="sendCredentials"
            />

            <Message
              v-if="state.auth.showMessage"
              severity="error"
              :message="state.auth.errorMessage"
            />
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
  gap: 2rem;
}

.header-section {
  margin-bottom: 1rem;
}

.title {
  font-size: 2.5rem;
  margin: 0 0 1rem;
  font-weight: bold;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.submit-button {
  margin-top: 1rem;
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
    height: 3rem;
  }

  .login-content {
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
  }
}
</style>
