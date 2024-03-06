import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '@/components/LoginPage'
import Student from '@/views/Student'
import Teacher from '@/views/Teacher'
import Admin from '@/views/Admin'
// 使用路由
Vue.use(VueRouter)

const routes =  [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },

  {
    path: '/student',
    name: 'Student',
    component: Student,
  },

  {
    path: '/teacher',
    name: 'Teacher',
    component: Teacher,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]
const router = new VueRouter({ 
   routes
})

const authUrls = ['/student', '/teacher', '/admin']

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 不在上方守卫的地址，直接放行
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  // 获取用户角色，可以从localStorage中获取
  const token = JSON.parse(localStorage.getItem('token'))
  const userRole = JSON.parse(localStorage.getItem('userRole'))
if(token) {
  // 判断用户角色并重定向到相应的页面
  if (userRole === '学生' && to.name !== 'Student') {
    next({ name: 'Student' })
  } else if (userRole === '老师' && to.name !== 'Teacher') {
    next({ name: 'Teacher' })
  } else if (userRole === '管理员' && to.name !== 'Admin') {
    next({ name: 'Admin' })
  } else {
    // 用户角色匹配或者是其他路由，正常跳转
    next()
  }
}else{
  next('/')
}
})

export default router;