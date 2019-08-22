<template>
  <section class="todo">
    <input type="text" class="add-input" autofocus="autofocus" placeholder="接下来要做什么？" @keyup.enter="addTodo">
    <Item :todo="todo" v-for="todo in filterTodos" :key="todo.id" @del="deleteTodo" />
    <Tabs :todos="todos" :filter="filter" @toggle="toggleFilter" @clearAll="clearAllCompleted"></Tabs>
  </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'

let id = 0

export default {
  components: {
    Item,
    Tabs
  },
  data() {
    return {
      todos: [],
      filter: 'all'
    }
  },
  computed: {
    filterTodos: function () {
      if (this.filter === 'all') {
        return this.todos
      }
      const filterCompleted = this.filter === 'completed'
      // console.log(this.todos.filter(todo => todo.completed === filterCompleted))
      return this.todos.filter(todo => todo.completed === filterCompleted)
    }
  },
  created() {
    let oldTodos = localStorage.getItem('todos')
    if (oldTodos) {
      this.todos = JSON.parse(oldTodos)
    }
    if(localStorage.getItem('id')) {
      id = localStorage.getItem('id')
    }
    console.log(process.env.NODE_ENV)
  },
  mounted() {
    window.onbeforeunload = e => { //  刷新时
      let todos = JSON.stringify(this.todos)
      localStorage.setItem('todos', todos)
      localStorage.setItem('id', id)
    }
  },
  methods: {
    addTodo(e) {
      this.todos.unshift({
        id: id++,
        content: e.target.value.trim(),
        completed: false
      })
      e.target.value = ''
    },
    deleteTodo(id) {
      this.todos.splice(this.todos.findIndex(todo => id === todo.id), 1)
    },
    toggleFilter(state) {
      console.log(state)
      this.filter = state
    },
    clearAllCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}
</script>

<style lang="scss" scoped>
.todo {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
  .add-input {
    position: relative;
    right: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: none;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    padding: 16px 16px 16px 36px;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }
}
</style>