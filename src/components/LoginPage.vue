<template>
  <div class="loginpage">
  <div class="login-container">
    <div class="title">
      <h2>
        <i class="el-icon-sunny"></i> 
        学生成绩管理系统
      </h2>
    </div>
    <el-form :model="loginForm" ref="loginForm" :rules="rules" label-width="80px">
      <el-form-item label="角色" prop="role">
        <el-radio-group v-model="loginForm.role">
          <el-radio label="stu">学生</el-radio>
          <el-radio label="teacher">老师</el-radio>
          <el-radio label="admin">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" 用户名" prop="username">
        <el-input prefix-icon="userIcon el-icon-user-solid" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input  prefix-icon="el-icon-lock" type="password" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
      <el-button round type="primary" class="loginbutoon" @click="login">登 录</el-button>
    </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from '../utils/request.js'
export default {
  data() {
    return {
      loginForm: {
        role: 'stu',
        username: '',
        password: '',
      },
      rules: {
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 登陆判断
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          // 使用axios发送登录请求
          const { role,username, password } = this.loginForm;
          await axios({
            url:`/login/${role}`,
            method:'POST',
            data:{
              username,
              password
            }
          }).then(response => {
            console.log(response);
            // 服务器返回的消息data为null 提示
            if(response.data.code===0) {
              this.$message.error('用户名或密码错误');
              return
            }
            this.$message.success('登陆成功')
            // 用于你好xxxx的数据存本地，可用vuex
            localStorage.setItem('nickname',JSON.stringify(response.data.data.nickname))
            localStorage.setItem('id',JSON.stringify(response.data.data.id))
            // 判断角色，跳转到相应的界面
            if(response.data.data.role=='学生') {
              // 本地存储token
              localStorage.setItem('token',JSON.stringify(response.data.data.token))
              localStorage.setItem('userRole', JSON.stringify(response.data.data.role))
              this.$router.push({name:'Student'})
            }

            if(response.data.data.role==='老师') {
              // 本地存储token
              localStorage.setItem('token',JSON.stringify(response.data.data.token))
              localStorage.setItem('userRole', JSON.stringify(response.data.data.role))
              this.$router.push({name:'Teacher'})
            }

            if(response.data.data.role==='管理员') {
              // 本地存储token
              localStorage.setItem('token',JSON.stringify(response.data.data.token))
              localStorage.setItem('userRole', JSON.stringify(response.data.data.role))
              this.$router.push({name:'Admin'})
            }
              
            }).catch(() => {
              // 处理登录失败的逻辑
              this.$message.error('服务器错误');
            });
        } else {
          this.$message.error('请填写用户名和密码');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
html{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.loginpage {
   width: 100vw; /*100%的视口宽度 */
   height: 100vh; /*100%的视口高度/*
  /* background: url('../assets/background.jpg') center center / cover;  居中并覆盖整个元素 */
  background: white;
  overflow: hidden; /* 隐藏溢出内容，防止滚动条出现 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  text-align: center;
  max-width: 400px;
  margin: 100px auto;
  padding: 20px 40px 20px 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background: white;
  overflow: hidden; /* 隐藏溢出内容，防止滚动条出现 */


}

.loginbutoon{
  width: 100px;
  margin: 0 50px 0 5px;
  text-align: center;
}
</style>