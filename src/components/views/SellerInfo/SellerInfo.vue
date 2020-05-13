<template>
  <div class="fnBox" >
    <div class="listBox" ref ="listBox">
<!--    <AddSellerInfo/>-->
    <SellerInfoList/>
    </div>
  </div>
</template>

<script>
/*import AddSellerInfo from "./AddSellerInfo";*/
import SellerInfoList from "./SellerInfoList";

export default {
  name: 'SellerInfo',
  data () { // 声明全局变量
    return {
    }
  },
  components: {//组件
/*      AddSellerInfo,*/
      SellerInfoList
  }
}
</script>

<style scoped>
  .fnBox {
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .listBox {
    min-width: 90%;
    max-width: 100%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
</style>
