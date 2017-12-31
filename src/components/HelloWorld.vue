<template>
  <div class="hello">
    <h1>HelloWorld</h1>
    <div class="img"></div>
    <h3 @click="testFn"
      v-html="test"></h3>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    asyncData({ store, route }) {
      //服务端预取数据钩子
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
  .img {
    background-image: url("../assets/logo.png");
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
</style>
