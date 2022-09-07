// 品牌管理模块
// url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'});
// 1.导入封装好的axios
import request from '@/utils/request'

// 向外导出该模块
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加品牌 post请求 携带2个参数：商品名称，商品LOGO 接口： /admin/product/baseTrademark/save
// 注意：id不需要传值，因为id是服务器生成

// 修改品牌接口 ： /admin/product/baseTrademark/update put请求 需要传id, 商品名称，logo
// 修改商品需要传id

export const reAddorupdateTradeMark = (tradeMark) => {
  // 如果向服务器传的有id则代表是修改操作
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    // 没有带id则是添加操作
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}
