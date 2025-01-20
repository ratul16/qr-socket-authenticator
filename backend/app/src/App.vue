<script setup></script>

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

          <!-- Timer Section -->
          <div class="timer-container">
            <!-- <span class="timer-text">{{ formatTime(timeLeft) }}</span> -->
            <ProgressBar :value="progress" :show-value="false" class="timer-bar" />
            <div class="mt-3">http://localhost:5173/authenticator</div>
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
