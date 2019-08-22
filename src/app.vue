<template>
  <div id="app">
    <Header></Header>
    <todo></todo>
    <Footer></Footer>
    <div id="cover"></div>
  </div>
</template>

<script>
import Header from '@/todo/header.vue'
import Footer from './todo/footer.jsx'
import Todo from './todo/todo.vue'

export default {
  components: {
    Header,
    Footer,
    Todo
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  #cover {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #999;
    opacity: 0.1;
    z-index: -1;
  }
}
</style>