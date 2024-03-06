<template>
    <div class="teacher-container">
       <!-- 头部栏 -->
    <el-header style="background-color: #409eff; color: #fff; padding: 10px;">
      <div class="user-info">
          <span style="float: left;">你好，{{ nickname }}老师</span>
      </div>
      <el-button style="float: right;" class="logout-btn" type="text" @click="logout">退出登录</el-button>
    </el-header>

    <el-container style="height: calc(100vh - 64px);"> <!-- 减去头部栏的高度 -->
        <!-- 侧边导航栏 -->
        <el-aside width="200px" style="height: 100%;">
          <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect">
            <el-menu-item index="1">录入成绩</el-menu-item>
            <el-menu-item index="2">查看成绩</el-menu-item>
          </el-menu>
        </el-aside>
  
        <!-- 主要内容区 -->
        <el-container>
      <el-main>
        <div v-show="activeMenu === '1'">
              <div class="search-container">
              <h3>录入成绩</h3>
              <div style="margin-bottom: 1px;">
              <el-input v-model="searchQuery" placeholder="请输入课程名称" style="width: 300px; margin-right: 10px;"></el-input>
              <el-button type="primary" @click="searchGrade">搜索</el-button>
              </div>
            </div>
              <el-table :data="grades" style="width: 100%">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="nickname" label="学生姓名"></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="fullPoint" label="满分绩点"></el-table-column>
                <el-table-column prop="point" label="绩点">
                  <template v-slot="scope">
                    <span v-if="scope.row.point<0">暂无</span>
                    <span v-else>{{ scope.row.point }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="成绩">
                  <template v-slot="scope">
                    <span v-if="scope.row.score<0">暂无</span>
                    <span v-else>{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editGrade(scope.row)">打分</el-button>
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
                :total="totalGrades">
              </el-pagination>
            </div>
            <div v-show="activeMenu === '2'">
              <div class="search-container">
              <h3>成绩</h3>
              <div style="margin-bottom: 1px;">
              <el-input v-model="searchQuery" placeholder="请输入课程名称" style="width: 300px; margin-right: 10px;"></el-input>
              <el-button type="primary" @click="searchGrade">搜索</el-button>
              </div>
            </div>
              <el-table :data="grades" style="width: 100%" >
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="nickname" label="学生姓名"></el-table-column>
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="fullPoint" label="满分绩点"></el-table-column>
                <el-table-column prop="point" label="绩点">
                  <template v-slot="scope">
                    <span v-if="scope.row.point<0">暂无</span>
                    <span v-else>{{ scope.row.point }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="成绩">
                  <template v-slot="scope">
                    <span v-if="scope.row.score<0">暂无</span>
                    <span v-else>{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="editGrade(scope.row)">修改</el-button>
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
                :total="totalGrades">
              </el-pagination>
            </div>
          </el-main>
        </el-container>
        <!-- 弹窗 -->
        <el-dialog title="修改成绩" :visible.sync="dialogVisible" width="30%" center>
          <el-form :model="editGradeForm" :rules="gradeRules" label-width="80px">
            <el-form-item label="学生姓名" prop="nickname">
              <el-input v-model="editGradeForm.nickname" disabled></el-input>
            </el-form-item>
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="editGradeForm.courseName" disabled></el-input>
            </el-form-item>
            <el-form-item label="成绩" prop="score">
              <el-input-number v-model="editGradeForm.score" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="绩点" prop="point">
              <el-input-number v-model="editGradeForm.point" :min="0" :max="4"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEditGradeForm">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-container>
    </div>
  </template>
  
  <script>
import axios from 'axios';
  export default {
    name: 'TeacherPage',
    data() {
      return {
        activeMenu: '1', // 默认选择的菜单
        editGradeForm: {
          id:null,
          courseId:null,
          nickname:null,
          courseName:null,
          score: null,
          point:null,
        },
        gradeRules: {
          score: [
            { required: true, message: '请输入成绩', trigger: 'blur' },
            { type: 'float', message: '成绩必须为数字值', trigger: 'blur' },
          ],
          point: [
            { required: true, message: '请输入绩点', trigger: 'blur' },
            { type: 'float', message: '成绩必须为数字值', trigger: 'blur' },
          ]
        },
        // 成绩数据
        grades: [],
        currentPage: 1,
        pageSize: 5,
        id:'',
        totalGrades: 0, // 总成绩数
        searchQuery:'', // 用于保存搜索查询
        // 控制修改成绩录入对话框的显示与隐藏
        dialogVisible: false, 
      };
    },
    created() {
      this.nickname = JSON.parse(localStorage.getItem('nickname'))
      this.id = JSON.parse(localStorage.getItem('id'))
      this.getInfo()
    },
    methods: {
      // 菜单栏切换
      handleMenuSelect(index) {
        this.activeMenu = index;
        if(index==='1') {
        this.getInfo()
      }
      if(index==='2') {
        this.getInfo()
      }
      },

  // 分页大小改变时
  handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getInfo();
    },

    // 当前页改变时
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getInfo();
    },

    searchGrade() {
      this.currentPage=1
      this.getInfo()
    },

    editGrade(row) {
        // 点击打分，修改按钮，弹出对话框，并将数据填充到表单中
        this.editGradeForm = {
          id:row.id,
          nickname: row.nickname,
          courseName: row.name,
          score: row.score,
          point: row.point
        };
        this.dialogVisible = true;
      },
      // 查询成绩页的提交按钮
      submitEditGradeForm() {
        // 提交修改成绩表单的逻辑，可以向后端发送请求进行保存
        this.editScore()
        this.dialogVisible = false;
      },
      // 退出登陆
      logout() {
        localStorage.clear()
        this.$router.push('/')
      },

      async getInfo() {
        // 查看成绩
      await axios({
        url:'/score/page',
        params:{
          teacherId:this.id,
          name:this.searchQuery || null,
          pageNo:this.currentPage,
          pageSize:this.pageSize
        }
      }).then(res =>{
        console.log(res);
        this.grades=res.data.data.list
        this.totalGrades=res.data.data.total;
      }).catch(err => {
        console.log(err);
      })
      },
      
      // 修改成绩请求
      async editScore() {
        await axios({
          url:'/score/correct',
          method:'PUT',
          data:{
            id:this.editGradeForm.id,
            nickname:this.editGradeForm.nickname,
            score:this.editGradeForm.score,
            point:this.editGradeForm.point
          }
        }).then(() => {
          this.$message.success('成绩已修改');
          // 修改完成重新渲染列表
          this.getInfo()
        }).catch( err => {
          console.log(err);
        })
      },
  },
};
  </script>
  
  <style scoped>
  .teacher-container {
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