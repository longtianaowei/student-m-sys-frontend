<template>
    <div class="admin-container">
            <!-- 头部栏 -->
    <el-header style="background-color: #409eff; color: #fff; padding: 10px;">
      <div class="user-info">
          <span style="float: left;">你好，{{ nickname }}管理员</span>
      </div>
      <el-button style="float: right;" class="logout-btn" type="text" @click="logout">退出登录</el-button>
    </el-header>

    <el-container style="height: calc(100vh - 64px);"> <!-- 减去头部栏的高度 -->
        <el-aside width="200px" style="height: 100%;">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect">
            <el-menu-item index="1">录入教师任课信息</el-menu-item>
            <el-menu-item index="2">任课信息</el-menu-item>
            <el-menu-item index="3">学生选课信息</el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <div v-show="activeMenu === '1'">
              <h3>录入教师任课信息</h3>
              <el-form :model="teacherCourseForm" :rules="teacherCourseRules" ref="teacherCourseForm" label-width="80px">
                <el-form-item label="教师姓名" prop="teacherName">
                  <el-input v-model="teacherCourseForm.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="name">
                  <el-input v-model="teacherCourseForm.name"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="info">
                  <el-input v-model="teacherCourseForm.info"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitTeacherCourseForm">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-show="activeMenu === '2'">
              <div class="search-container">
              <h3>任课信息</h3>
              <div style="margin-bottom: 1px;">
              <el-input v-model="searchQuery1" placeholder="请输入课程名称" style="width: 300px; margin-right: 10px;"></el-input>
              <el-button type="primary" @click="searchCourse">搜索</el-button>
              </div>
              </div>
              <el-row :gutter="20">
              <el-col :span="8" v-for="item in course" :key="item.id">
                <el-card :body-style="{ padding: '10px' }" >
                  <h4>{{ item.name }}</h4>
                  <p>教师: {{ item.nickname }}</p>
                  <p>简介: {{ item.info }}</p>
                  <el-button @click="deleteCourse(item.id)">删除</el-button>
                </el-card>
              </el-col>
            </el-row>
            <el-pagination class="page-next"
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1">
            </el-pagination>
          </div>
          <div v-show="activeMenu === '3'">
              <div class="search-container">
              <h3>学生选课信息</h3>
              <div style="margin-bottom: 1px;">
              <el-input v-model="searchQuery" placeholder="请输入学生姓名" style="width: 300px; margin-right: 10px;"></el-input>
              <el-button type="primary" @click="searchStudent">搜索</el-button>
              </div>
            </div>
              <el-table :data="student" style="width: 100%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="courseId" label="课程编号"></el-table-column>
                <el-table-column prop="nickname" label="学生姓名"></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editStudent(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteStudent(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <el-pagination class="page-next"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
              </el-pagination>
            </div>
          </el-main>
        </el-container>
            <!-- 弹窗 -->
            <el-dialog title="修改学生选课信息" :visible.sync="dialogVisible" width="30%" center>
          <el-form :model="studentCourseForm" :rules="studentCourseRules" label-width="80px">
            <el-form-item label="ID" prop="id">
              <el-input v-model="studentCourseForm.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="studentCourseForm.courseName"></el-input>
            </el-form-item>
            <el-form-item label="老师姓名" prop="teacherName">
              <el-input v-model="studentCourseForm.teacherName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitStudentCourseForm">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-container>
    </div>
  </template>
  
  <script>
  import axios from '@/utils/request.js'
  export default {
    name: 'AdminPage',
    data() {
      return {
        activeMenu: '1', 
        teacherCourseForm: {
          name: '',
          info:'',
          teacherName: '',
        },
        teacherCourseRules: {
          teacherName: [
            { required: true, message: '请输入教师姓名', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ],
          info: [
            { required: true, message: '请输入课程简介', trigger: 'blur' },
          ],
        },
        studentCourseForm: {
          id:'',
          studentName: '',
          courseName: '',
        },
        studentCourseRules: {
          studentName: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' },
          ],
          courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ],
        },
        // 控制修改成绩录入对话框的显示与隐藏
        dialogVisible: false, 
        course:[],
        student:[],
        currentPage: 1,
        pageSize: 5,
        currentPage1: 1,
        pageSize1: 5,
        searchQuery:'',
        searchQuery1:'',
        total: 0,
        total1: 0
      };
    },
    created() {
      this.nickname = JSON.parse(localStorage.getItem('nickname'))
    },
    methods: {
      handleMenuSelect(index) {
        this.activeMenu = index;
        if(index==='2') {
        this.getCourse()
      }
      if(index==='3') {
        this.getStudent()
      }
      },
      submitTeacherCourseForm() {
        this.updataCourse()
        this.$refs.teacherCourseForm.resetFields();
      },

      editStudent(row) {
        // 点击修改按钮，弹出对话框，并将数据填充到表单中
        this.studentCourseForm = {
          id:row.id,
          teacherName: row.teacherNamename,
          courseName: row.courseName,
        };
        this.dialogVisible = true;
      },

      submitStudentCourseForm() {
        this.updataStudent()
        this.dialogVisible =false
      },
      
      // 分页大小改变时
  handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getStudent();
    },

    // 当前页改变时
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getStudent();
    },

      // 分页大小改变时
  handleSizeChange1(newSize) {
      this.pageSize1 = newSize;
      this.getCourse();
    },

    // 当前页改变时
    handleCurrentChange1(newPage) {
      this.currentPage1 = newPage;
      this.getCourse();
    },


    searchCourse() {
      this.currentPage1=1
      this.getCourse()
    },

    searchStudent() {
      this.currentPage=1
      this.getStudent()
    },
      logout() {
        localStorage.clear()
        this.$router.push('/')
      },

      

    async getStudent() {
        await axios({
          url: '/score/page',
          params:{
            nickname:this.searchQuery ||null,
            name: null,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
          }
        }).then(res => {
          console.log(res)
          this.student=res.data.data.list
          this.total=res.data.data.total
        }).catch(err => {
          console.log(err)
        })
      },

      async updataStudent() {
        await axios({
          url: '/student-course',
          method:'PUT',
          data:{
            id:this.studentCourseForm.id,
            teacherName:this.studentCourseForm.teacherName,
            courseName:this.studentCourseForm.courseName
          }
        }).then(res => {
          console.log(res)
          this.getStudent()
        }).catch(err => {
          console.log(err)
        })
      },


      async deleteStudent(row) {
        await axios({
          url: `/student-course/${row.id}`,
          method:'DELETE'
        }).then(res => {
          console.log(res)
          this.getStudent()
        }).catch(err => {
          console.log(err)
        })
      },

      async getCourse() {
        await axios({
          url:'/teacher-course/page',
          params:{
            name: this.searchQuery1 || null,
            pageNo: this.currentPage1,
            pageSize: this.pageSize1
          }
        }).then(res => {
          console.log(res)
          this.course=res.data.data.list
          this.total1=res.data.data.total
        }).catch(err => {
          console.log(err)
        })
      },

      async updataCourse() {
        await axios({
          url:'/course',
          method:'POST',
          data:{
            name:this.teacherCourseForm.name,
            info:this.teacherCourseForm.info,
            teacherName:this.teacherCourseForm.teacherName
          }
        }).then( res => {
          if(res.data.code===0) {
            this.$message.error('录入失败')
            return
          }
          this.getCourse()
          this.$message.success('教师任课信息已录入');
        }).catch(err => {
          console.log(err);
        })
      },

      async deleteCourse(id) {
        await axios({
          url:`/course/${id}`,
          method:'DELETE',
        }).then(res => {
          console.log(res);
          this.getCourse()
        }).catch(err => {
          console.log(err);
        })
      },


    },
  };
  </script>
  
  <style scoped>
  .admin-container {
    height: 100vh;
  }
  
  .el-aside {
    background-color: #f4f4f5;
  }
  
  .el-main {
    padding: 20px;
  }

  .logout-btn {
  color: #fff;
}

.user-info {
  margin-top: 10px;
}

.page-next {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 50px; /* 或根据需要调整 */
}
  </style>