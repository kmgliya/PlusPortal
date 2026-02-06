<template>
  <div class="auth-page">
    <section class="auth-card">
      <div class="auth-visual">
        <AuthIllustration />
      </div>
      <div class="auth-content">
        <span class="auth-eyebrow">Добро пожаловать в PlusPortal</span>
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
          <p v-else-if="isBlocked" class="helper">
            Попробуйте через {{ remainingLabel }}
          </p>
          <p v-else class="helper">
            Админ вход: <strong>{{ adminEmail }}</strong> / <strong>{{ adminPassword }}</strong>
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthIllustration from '../components/AuthIllustration.vue'

const adminEmail = 'nikolay@gmail.com'
const adminPassword = '123456789'
const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 15
const STORAGE_KEY = 'pp_auth_guard'
const USERS_KEY = 'pp_users'
const CURRENT_USER_KEY = 'pp_current_user'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isBlocked = ref(false)
const isLoading = ref(false)
const lockUntil = ref(0)
const now = ref(Date.now())
let tickId

const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
  if (successMessage.value) {
    successMessage.value = ''
  }
}

const loadGuardState = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    lockUntil.value = 0
    isBlocked.value = false
    return
  }

  const parsed = JSON.parse(stored)
  const storedLockUntil = parsed?.lockUntil ?? 0
  if (storedLockUntil > Date.now()) {
    lockUntil.value = storedLockUntil
    isBlocked.value = true
    errorMessage.value = 'Слишком много попыток. Вход временно заблокирован.'
  } else {
    lockUntil.value = 0
    isBlocked.value = false
  }
}

const saveGuardState = (attempts, until) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ attempts, lockUntil: until }))
}

const resetGuardState = () => {
  localStorage.removeItem(STORAGE_KEY)
  lockUntil.value = 0
  isBlocked.value = false
}

const remainingLabel = computed(() => {
  const diff = Math.max(lockUntil.value - now.value, 0)
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const handleSubmit = async () => {
  if (isBlocked.value) {
    return
  }

  isLoading.value = true
  successMessage.value = ''

  const stored = localStorage.getItem(STORAGE_KEY)
  const parsed = stored ? JSON.parse(stored) : { attempts: 0, lockUntil: 0 }

  const storedUsers = localStorage.getItem(USERS_KEY)
  const users = storedUsers ? JSON.parse(storedUsers) : []
  const matchedUser = users.find(
    (user) => user.email === email.value && user.password === password.value
  )

  const isAdminMatch = email.value === adminEmail && password.value === adminPassword

  if (matchedUser?.blocked) {
    errorMessage.value = 'Пользователь заблокирован администратором'
    isLoading.value = false
    return
  }

  if (isAdminMatch || matchedUser) {
    errorMessage.value = ''
    resetGuardState()
    localStorage.setItem('pp_token', 'demo-jwt-token')
    const userPayload = isAdminMatch
      ? {
          fullName: 'Администратор',
          email: adminEmail,
          department: 'Администрация',
          position: 'Администратор',
          role: 'admin',
        }
      : {
          fullName: matchedUser.fullName,
          email: matchedUser.email,
          department: matchedUser.department,
          position: matchedUser.position,
          role: 'employee',
        }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userPayload))
    successMessage.value = 'Успешный вход. Токен сохранен локально.'
    setTimeout(() => {
      router.push(isAdminMatch ? '/admin/home' : '/home')
    }, 300)
  } else {
    const nextAttempts = (parsed.attempts ?? 0) + 1
    if (nextAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_MINUTES * 60 * 1000
      lockUntil.value = until
      isBlocked.value = true
      errorMessage.value = 'Слишком много попыток. Вход временно заблокирован.'
      saveGuardState(nextAttempts, until)
    } else {
      errorMessage.value = 'Неправильный пароль'
      saveGuardState(nextAttempts, 0)
    }
  }

  isLoading.value = false
}

onMounted(() => {
  loadGuardState()
  tickId = setInterval(() => {
    now.value = Date.now()
    if (isBlocked.value && lockUntil.value && lockUntil.value <= now.value) {
      resetGuardState()
      errorMessage.value = ''
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (tickId) {
    clearInterval(tickId)
  }
})
</script>
