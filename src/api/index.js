// 将四个模块请求的接口函数统一暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

// 对外暴露 在main.js入口文件中引入相关API请求接口
export default {
  trademark,
  attr,
  sku,
  spu
}
