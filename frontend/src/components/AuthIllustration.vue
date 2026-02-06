<template>
  <video
    class="auth-illustration"
    :src="authVideo"
    autoplay
    loop
    muted
    playsinline
  ></video>
</template>

<script setup>
import authVideo from '../../auth-dog.mp4'
</script>
