<template>
  <div class="main-container">
    <Header />

    <ContentContainer>
      <CarsSection />
    </ContentContainer>

    <footer>Made by ...</footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

import Header from './components/Header.vue';
import ContentContainer from './components/ContentConttainer.vue';
import CarsSection from './components/CarsSection.vue';

useHead({
  title: 'Car Management System',
  meta: [{
    name: "color-scheme",
    content: "dark light"
  }],
})
</script>

<style lang="scss">
.main-container {
  height: 100%;
  margin: 2rem 0;
}
</style>
