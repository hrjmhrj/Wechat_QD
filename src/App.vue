<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    this.$store.dispatch('getInfo');
  },
}
</script>

<style>
html{
  height: 100vh !important;
}
body{
  margin: 0 !important;
  padding: 0;
  box-sizing: border-box !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width:100%;
  height:100%;
}
</style>
