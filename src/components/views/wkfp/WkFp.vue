<template>
  <div>
    <WkFpList/>
    <WkFpSearch/>
  </div>
</template>

<script>
  import WkFpSearch from "./WkFpSearch";
  import WkFpList from "./WkFpList";

  export default {
    name: 'WkFp',
    data() { // 声明全局变量
      return {}
    },
    components: {
      WkFpSearch,
      WkFpList,
    }
  }
</script>

<style scoped>
</style>
