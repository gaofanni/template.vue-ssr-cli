<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3 @click="testFn">{{test}}</h3>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    asyncData({ store, route }) {
      return store.dispatch("getTest", { test: 2 });
    },
    computed: {
      test() {
        return this.$store.state.test;
      }
    },
    data() {
      return {
        msg: "Welcome to Your Vue.js App"
      };
    },
    methods: {
      testFn() {
        this.$store.commit("setTest", "hhhh");
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
