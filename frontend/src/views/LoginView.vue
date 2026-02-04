<template>
  <section class="auth-card">
    <div class="auth-visual">
      <AuthIllustration />
    </div>
    <div class="auth-content">
      <h1>
        Ну что, продолжим
        <br />
        этот <span class="accent">классный</span> день?
      </h1>
      <p class="auth-subtitle">
        Авторизуйся, чтобы продолжить онбординг, вести свои задачи и сохранять
        весь прогресс в одном месте.
      </p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="field-label">Почта</span>
          <input
            v-model.trim="email"
            type="email"
            placeholder="Почта"
            autocomplete="email"
            @input="clearError"
            required
          />
        </label>

        <label class="field">
          <span class="field-label">Пароль</span>
          <input
            v-model.trim="password"
            type="password"
            placeholder="Пароль"
            autocomplete="current-password"
            :class="{ error: errorMessage }"
            @input="clearError"
            required
          />
          <span v-if="errorMessage" class="field-error">{{ errorMessage }}</span>
        </label>

        <button class="primary-button" :disabled="isBlocked || isLoading">
          {{ isBlocked ? 'Вход заблокирован' : 'Войти' }}
        </button>

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-else class="helper">
          Тестовый вход: <strong>{{ demoEmail }}</strong> / <strong>{{ demoPassword }}</strong>
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AuthIllustration from '../components/AuthIllustration.vue'

const demoEmail = 'admin@plusportal.ru'
const demoPassword = 'Plus12345'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isBlocked = ref(false)
const isLoading = ref(false)

const clearError = () => {
  if (isBlocked.value) {
    isBlocked.value = false
  }
  if (errorMessage.value) {
    errorMessage.value = ''
  }
  if (successMessage.value) {
    successMessage.value = ''
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  successMessage.value = ''

  if (email.value === demoEmail && password.value === demoPassword) {
    errorMessage.value = ''
    isBlocked.value = false
    localStorage.setItem('pp_token', 'demo-jwt-token')
    successMessage.value = 'Успешный вход. Токен сохранен локально.'
  } else {
    errorMessage.value = 'Неправильный пароль'
    isBlocked.value = true
  }

  isLoading.value = false
}
</script>
