<template>
  <ThreeComponent/>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import ThreeComponent from './components/ThreeComponent.vue';

export default {
  name: 'App',
  components: {
    // HelloWorld
    ThreeComponent,
  }
}
</script>

<style>
  * { margin : 0; }
  html, body { height: 100%; }
</style>
