<template>
  <section class="admin">
    <div class="admin-header">
      <div>
        <h1>Админ-панель</h1>
        <p>Создание и блокировка учетных записей сотрудников.</p>
      </div>
      <div class="admin-badge">Classic Auth</div>
    </div>

    <div class="admin-grid">
      <form class="admin-card" @submit.prevent="handleCreate">
        <h2>Новый пользователь</h2>

        <label class="field">
          <span class="field-label">ФИО</span>
          <input v-model.trim="fullName" type="text" placeholder="Фамилия Имя" required />
        </label>

        <label class="field">
          <span class="field-label">Почта</span>
          <input v-model.trim="email" type="email" placeholder="email@company.ru" required />
        </label>

        <label class="field">
          <span class="field-label">Пароль</span>
          <input v-model.trim="password" type="password" placeholder="Пароль" required />
        </label>

        <label class="field">
          <span class="field-label">Отдел</span>
          <select v-model="department" required>
            <option disabled value="">Выберите отдел</option>
            <option>HR</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Product</option>
            <option>Marketing</option>
          </select>
        </label>

        <button class="primary-button" :disabled="isSaving">Создать</button>
        <p v-if="success" class="success">{{ success }}</p>
      </form>

      <div class="admin-card">
        <h2>Сотрудники</h2>
        <div v-if="users.length === 0" class="helper">
          Пока нет созданных пользователей. Добавьте первого сотрудника слева.
        </div>
        <ul v-else class="user-list">
          <li v-for="user in users" :key="user.id" class="user-row">
            <div>
              <div class="user-name">{{ user.fullName }}</div>
              <div class="user-meta">
                {{ user.email }} • {{ user.department }}
              </div>
            </div>
            <button
              class="ghost-button"
              :class="{ danger: user.blocked }"
              @click="toggleBlock(user.id)"
            >
              {{ user.blocked ? 'Разблокировать' : 'Заблокировать' }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const department = ref('')
const success = ref('')
const isSaving = ref(false)
const users = ref([])

const STORAGE_KEY = 'pp_users'

const loadUsers = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  users.value = stored ? JSON.parse(stored) : []
}

const persistUsers = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value))
}

const resetForm = () => {
  fullName.value = ''
  email.value = ''
  password.value = ''
  department.value = ''
}

const handleCreate = () => {
  isSaving.value = true
  const newUser = {
    id: crypto.randomUUID(),
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    department: department.value,
    blocked: false,
  }

  users.value.unshift(newUser)
  persistUsers()
  resetForm()
  success.value = 'Пользователь создан и добавлен в список.'
  isSaving.value = false
}

const toggleBlock = (id) => {
  users.value = users.value.map((user) =>
    user.id === id ? { ...user, blocked: !user.blocked } : user
  )
  persistUsers()
}

onMounted(() => {
  loadUsers()
})
</script>
