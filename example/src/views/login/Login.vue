<template>
  <div class="demo-ruleForm login-container">
    <h3 class="title">ログイン</h3>
    <div>
      <label for="">ログインID：</label>
      <input type="password" style="width:100%;"/>
    </div>
    <button class="login-btn" type="primary" style="width:100%;" @click="handleLogin">ログイン</button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    handleLogin () {
      this.$router.push({ path: '/home' })
    }
  }
}

</script>

<style scoped>
  input {
    outline: none;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login-container input[type="password"] {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    margin: 0;
    padding: 10px 15px;
    border-radius: 4px;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  .login-btn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    margin: 0;
    padding: 10px 15px;
    border-radius: 4px;
    margin-top: 100px;
  }
</style>
