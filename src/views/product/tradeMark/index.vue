<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>

    <!-- 表格数据 -->
    <el-table style="width:100% border" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页处理 -->
    <el-pagination
      style="margin-top:20px;
      textAlign:center"
      :current-page="page"
      :total="total"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      :page-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />

    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性，这个属性的作用是把表单的数据收集到那个对象的身上，将来表单验证，也需要这个属性 -->
      <el-form style="width: 80%;">
        <el-form-item label="品牌名称" label-width="100px" :model="tmform">
          <el-input v-model="tmform.tmName" autocomplete="off">1</el-input>
        </el-form-item>
        <!-- 这里收集图片不能使用v-model，因为这不是表单元素 -->
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmform.logoUrl" :src="tmform.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 默认页
      page: 1,
      // 当前页数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表数据
      list: [],
      // 对话框显示隐藏控制的属性
      dialogFormVisible: false,
      // 收集品牌信息，对象身上的属性，不能瞎写，需要看文档
      tmform: {
        tmName: '',
        logoUrl: ''
      }
    }
  },
  // 组件挂载完毕发送请求
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    // 获取列表数据的方法
    async getPageList(pager = 1) {
      // 点击页码赋值给page
      this.page = pager
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表的接口
      // 当向服务器发送请求的时候，这个参数需要带参数，因此需要在data中初始化两个字段
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      // console.log(result)
      // 判断接口返回的状态码。如果为正常200则把数据保存到本地数据源data中
      if (result.code === 200) {
        // 接口返回的页码总条数
        this.total = result.data.total
        // 接口返回的list数据
        this.list = result.data.records
      }
    },
    handleSizeChange(limit) {
      // 点击分页器某一页需要展示数据条数发生变化的时候触发
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框把对话框的值改为true
      this.dialogFormVisible = true
      this.tmform = {
        tmName: '',
        logoUrl: ''
      }
    },
    updateTradeMark(row) {
      // 显示对话框把对话框的值改为true
      this.dialogFormVisible = true
      // console.log(row)
      this.id = row.id
      this.tmform.tmName = row.tmName
      this.tmform.logoUrl = row.logoUrl
    },

    // 当图片上传成功的回调函数
    handleAvatarSuccess(res, file) {
      // res: 上传成功返回前端数据
      // file: 上传成功服务器返回给前端数据
      // console.log(res)
      // console.log(file)
      this.tmform.logoUrl = res.data
    },

    // 上传图片之前相关的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 点击确定向服务器发送请求
    async addOrUpdateTradeMark() {
      // 点击确定之后对话框隐藏
      this.dialogFormVisible = false
      // 然后向服务器发送添加请求(这里可能是添加或者是修改操作)
      const result = await this.$API.trademark.reAddorupdateTradeMark(this.tmform)
      if (result.code == 200) {
        this.$message(this.tmform.id ? '修改成功' : '添加成功')
        // 添加或者修改成功之后需要再次向服务器发送一次请求，以此来更新数据列表
        this.getPageList()
      }
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
