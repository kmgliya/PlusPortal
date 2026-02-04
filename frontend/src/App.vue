<template>
  <div class="app">
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark">+</span>
        PlusPortal
      </div>
      <nav class="nav">
        <RouterLink to="/login">Авторизация</RouterLink>
        <RouterLink to="/admin/users">Админка</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
