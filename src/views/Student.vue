<template>
  <div class="student-container">
    <!-- 头部栏 -->
    <el-header style="background-color: #409eff; color: #fff; padding: 10px;">
      <div class="user-info">
          <span style="float: left;">你好，{{ nickname }}同学</span>
      </div>
      <el-button style="float: right;" class="logout-btn" type="text" @click="logout" >退出登录</el-button>
    </el-header>

    <el-container style="height: calc(100vh - 64px);"> <!-- 减去头部栏的高度 -->
      <!-- 侧边导航栏 -->
      <el-aside width="200px" style="height: 100%;">
        <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect" >
          <el-menu-item index="1">选课</el-menu-item>
          <el-menu-item index="2">查看成绩</el-menu-item>
        </el-menu>
      </el-aside>

     <!-- 主要内容区 -->
      <el-container>
        <el-main>
          <div v-show="activeMenu === '1'">
            <div class="search-container">
              <h3>选课</h3>
              <div style="margin-bottom: 1px;">
              <el-input v-model="searchQueryCourse" placeholder="请输入课程名称" style="width: 300px; margin-right: 10px;"></el-input>
              <el-button type="primary" @click="searcheCourse">搜索</el-button>
              </div>
            </div>
            <el-row :gutter="20">
              <el-col :span="8" v-for="course in courses" :key="course.id">
                <el-card :body-style="{ padding: '10px' }" >
                  <h4>{{ course.name }}</h4>
                  <p>教师: {{ course.nickname }}</p>
                  <p>简介: {{ course.info }}</p>
                  <el-button @click="selectCourse(course.id)" :disabled="course.selected">选课</el-button>
                </el-card>
              </el-col>
            </el-row>
            <el-pagination class="page-next"
      @size-change="handleCourseSizeChange"
      @current-change="handleCourseCurrentChange"
      :current-page="courseCurrentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="coursePageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCoures">
    </el-pagination>
          </div>
          <div v-show="activeMenu === '2'">
                  <div class="search-container">
                  <h3>查看成绩</h3>
                  <div style="margin-bottom: 1px;">
                  <el-input v-model="searchQueryGrade" placeholder="请输入课程名称" style="width: 300px; margin-right: 10px;"></el-input>
                  <el-button type="primary" @click="searchGrade">搜索</el-button>
                </div>
              </div>
            <el-table :data="grades" style="width: 100%">
                <el-table-column prop="name" label="课程名称"></el-table-column>
                <el-table-column prop="fullPoint" label="满分绩点"></el-table-column>
                <el-table-column prop="point" label="绩点">
                  <template v-slot="scope">
                    <span v-if="scope.row.point === -1">暂无</span>
                    <span v-else>{{ scope.row.point }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="成绩">
                  <template v-slot="scope">
                    <span v-if="scope.row.score === -1">暂无</span>
                    <span v-else>{{ scope.row.score }}</span>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination class="page-next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="gradeCurrentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="gradePageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalGrades">
    </el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from '@/utils/request.js'
export default {
  name: 'StudentHome',
  data() {
    return {
      activeMenu: '1', // 默认选择的菜单
      courses: [],
      grades: [],
      selectedCourseId: null, // 保存选中的课程ID
      // 你好xxx的
      nickname:'',
      id:'',
      searchQueryGrade: '',// 用于保存搜索查询成绩
      searchQueryCourse: '',// 用于保存搜索查询课程
      courseCurrentPage: 1,
      coursePageSize: 5,
      gradeCurrentPage: 1,
      gradePageSize: 5,
      totalGrades: 0, // 总成绩数
      totalCoures: 0, // 总课程数

    };
  },
mounted() {
  this.nickname = JSON.parse(localStorage.getItem('nickname'))
  this.id = JSON.parse(localStorage.getItem('id'))
  this.getCourse()
},
  methods: {
  // 分页大小改变时
  handleSizeChange(newSize) {
      this.gradePageSize = newSize;
      this.getGrade();
    },

    // 当前页改变时
    handleCurrentChange(newPage) {
      this.gradeCurrentPage = newPage;
      this.getGrade();
    },

      // 分页大小改变时
    handleCourseSizeChange(newSize) {
      this.coursePageSize = newSize;
      this.getCourse();
    },

    // 当前页改变时
  handleCourseCurrentChange(newPage) {
      this.courseCurrentPage = newPage;
      this.getCourse();
    },

    searchGrade() {
      this.gradeCurrentPage=1
      this.getGrade()
    },

    searcheCourse() {
      this.courseCurrentPage=1
      this.getCourse()
    },

      // 切换左边导航
    handleMenuSelect(index) {
      this.activeMenu = index;
      if(index==='1') {
        this.getCourse()
      }
      if(index==='2') {
        this.getGrade()
      }
    },

    selectCourse(courseId) {
    // 设置选中的课程ID，显示对话框
    this.selectedCourseId = courseId;
    this.isSure()
  },

  isSure() {
      this.$confirm('确认选中该课程吗？选中后无法修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定把选中的课程，选课按钮改为不可点击
        const selectedCourse = this.courses.find(course => course.id === this.selectedCourseId);
        selectedCourse.selected = true;
        this.choseCourse()
     
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消选课'
        });          
      });
    },
    logout() {
      localStorage.clear()
      this.$router.push('/')
    },

    // 请求课程数据
   async getCourse() {
     await axios({
      url:'/sc/pagec',
      method: 'GET',
      params:{
        name:this.searchQueryCourse || null,
        pageSize: this.coursePageSize,
        pageNo: this.courseCurrentPage,
      }
    }).then(res=>{
      // 得到数据渲染
      this.courses=res.data.data.list
      this.totalCoures=res.data.data.total;
    }).catch(err=>{
      console.log(err);
    })
    },
    // 请求成绩数据
   async getGrade() {
    await axios({
      url:'/sc/pages',
      method: 'GET',
      params:{
        name: this.searchQueryGrade || null, // 根据搜索查询获取成绩
          studentId:this.id,
          pageSize: this.gradePageSize,
          pageNo: this.gradeCurrentPage,
    }
  }).then(res=>{
    // 得到数据并渲染
    this.grades=res.data.data.list
    this.totalGrades=res.data.data.total;
  }).catch(err=>{
    console.log(err);
  })
  },
    //选课请求
    async choseCourse() {
      await axios({
      url:'/student-course/choose',
      method: 'POST',
      data:{
        studentId:this.id,
        courseId:this.selectedCourseId,
      }
    }).then(res=>{
      if(res.data.code===0) {
        this.$message({
          type: 'error',
          message: '您已选过这门课程!'
        });
        return
      }
      this.getGrade()
      this.$message({
          type: 'success',
          message: '选课成功!'
        });
    }).catch(err=>{
      console.log(err);
    })
  },
  },


};
</script>

<style scoped>
.student-container {
  height: 100vh;
}

.el-aside {
  background-color: #f4f4f5;
}

.el-main {
  padding: 20px;
}

.el-card {
  margin-bottom: 10px;
}

.logout-btn {
  color: #fff;
}

.page-next {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

.user-info {
  margin-top: 10px;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 50px; /* 或根据需要调整 */
}
</style>