<template>
  <div>
    <HomeList/>
    <HomeSearch/>
  </div>
</template>

<script>
  import HomeSearch from './HomeSearch';
  import HomeList from './HomeList';

  export default {
    name: 'Home',
    data () { // 声明全局变量
      return {
      };
    },
    components: {
      HomeSearch,
      HomeList
    }
  };
</script>

<style scoped>
</style>
