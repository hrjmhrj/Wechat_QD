<template>
  <div>
    <QxGnTreeList/>
    <QxGnTreeAddAndEdit/>
    <QxGnTreeListSelect/>
  </div>
</template>

<script>
  import QxGnTreeList from './QxGnTreeList'
  import QxGnTreeAddAndEdit from './QxGnTreeAddAndEdit'
  import QxGnTreeListSelect from './QxGnTreeListSelect'

  export default {
    name: 'qx-gn-tree',
    data () { // 声明全局变量
      return {
      }
    },
    components: {
      QxGnTreeList,
      QxGnTreeAddAndEdit,
      QxGnTreeListSelect
    }
  }
</script>

<style scoped>
</style>
