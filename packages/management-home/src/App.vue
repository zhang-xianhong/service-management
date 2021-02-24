<template>
  <div class="apps">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
html,body{
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
#app {
  background-color: #f2f2f2;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Avenir', Helvetica, Arial, sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.apps{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
