<template>
  <section class="admin-page">
    <div class="admin-title">
      <h1>Управление сотрудниками</h1>
      <p>Создание, редактирование и блокировка учетных записей сотрудников.</p>
    </div>

    <form class="admin-panel" @submit.prevent="handleCreate">
      <div class="admin-panel-header">
        <h2>Новый сотрудник</h2>
        <div class="admin-panel-icon">+</div>
      </div>

      <label class="field">
        <span class="field-label">ФИО</span>
        <input v-model.trim="fullName" type="text" placeholder="Иванов Иван Иванович" required />
      </label>

      <label class="field">
        <span class="field-label">Электронная почта</span>
        <input v-model.trim="email" type="email" placeholder="ivanov@company.com" required />
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

      <label class="field">
        <span class="field-label">Позиция</span>
        <input v-model.trim="position" type="text" placeholder="Frontend Developer" required />
      </label>

      <div class="admin-actions">
        <button class="secondary-button" type="button" @click="resetForm">Отмена</button>
        <button class="primary-button" :disabled="isSaving">Создать пользователя</button>
      </div>

      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const department = ref('')
const position = ref('')
const success = ref('')
const isSaving = ref(false)
const STORAGE_KEY = 'pp_users'

const resetForm = () => {
  fullName.value = ''
  email.value = ''
  password.value = ''
  department.value = ''
  position.value = ''
}

const handleCreate = () => {
  isSaving.value = true
  const newUser = {
    id: crypto.randomUUID(),
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    department: department.value,
    position: position.value,
    blocked: false,
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  const existing = stored ? JSON.parse(stored) : []
  existing.unshift(newUser)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  resetForm()
  success.value = 'Пользователь создан и добавлен в список.'
  isSaving.value = false
}
</script>
