import ajax from "./ajax";
// let url = '39.104.81.187:8080' // 正式
let url = '39.104.81.187:8081' // 测试

// 正则测试
// let url = '39.104.81.187:8082'

export const JsonUrl = 'https://static.jiefengnews.com'
// export const urlStr = 'http://localhost:3001'
// export const urlStr = 'http://test.ds.jiefengnews.cn'
// 正则 测试
export const urlStr = 'http://testregex.ds.jiefengnews.cn'


/* 用户模块 */

// 获取验证码
export const getCode = (obj) => ajax(`http://${url}/ds/user/token`, obj, 'POST')
// 注册
export const register = (obj) => ajax(`http://${url}/ds/user/register`, obj, 'POST')
// 登录
export const login = (obj) => ajax(`http://${url}/ds/user/login`, obj, 'POST')
// 登出
export const logout = (obj) => ajax(`http://${url}/ds/user/logout`, obj, 'POST')
// 修改密码
export const changePassword = (obj) => ajax(`http://${url}/ds/user/password`, obj, 'PUT')

/* 工单模块 */

// 添加工单
export const addOrder = (obj) => ajax(`http://${url}/ds/ticket`, obj, 'POST')
// 用户查看工单列表
export const orderList = (obj) => ajax(`http://${url}/ds/ticket`, obj, 'GET')
// 用户修改工单
export const changeOrder = (obj) => ajax(`http://${url}/ds/ticket`, obj, 'PUT')

/* 订单模块 */

// 添加订单
export const addForm = (obj) => ajax(`http://${url}/ds/order`, obj, 'POST')
// 查看订单列表
export const formList = (obj) => ajax(`http://${url}/ds/order`, obj, 'GET')
// 支付订单
export const payForm = (obj) => ajax(`http://${url}/ds/order`, obj, 'PUT')
// 获取订单状态
export const formStatus = (obj) => ajax(`http://${url}/ds/order/status`, obj, 'PATH')

/* 页面模块 */

// 添加页面
export const addPage = (obj) => ajax(`http://${url}/ds/page`, obj, 'POST')
// 查看页面列表
export const pageList = (obj) => ajax(`http://${url}/ds/page/list`, obj, 'GET')
// 修改页面
export const changePage = (obj) => ajax(`http://${url}/ds/page`, obj, 'PUT')
// 删除页面
export const delPage = (obj) => ajax(`http://${url}/ds/page`, obj, 'DELETE')
// 获取单个的配置
export const pageConfig = (obj) => ajax(`http://${url}/ds/page`, obj, 'GET')


// 搜索模块

// 获取数据源列表
export const fieldList = (obj) => ajax(`http://${url}/ds/db`, obj, 'GET')
// 获取数据源过滤信息
export const filterInfo = (obj) => ajax(`http://${url}/ds/db/field`, obj, 'PATH')
// 获取企业列表
export const companyList = (obj) => ajax(`http://${url}/ds/search/enterprise`, obj, 'POST')
// 搜索提示信息
export const recommendList = (obj) => ajax(`http://39.104.81.187:8111/ds/search/recommend`, obj, 'POST')
// 搜索信息流
export const search = (obj) => ajax(`http://${url}/ds/search`, obj, 'POST')
// 获取信息摘要
export const abstract = (obj) => ajax(`http://${url}/ds/search/content`, obj, 'GET')
// 获取面板图表数据
export const chartData = (obj) => ajax(`http://${url}/ds/dashboard`, obj, 'POST')

//test
export const queryDataFlow = (obj) => ajax(`https://api.test.zhaobiao.jiefengnews.cn/zhongzhao/dataflow`, obj, 'POST')


// 支付模块

// 用户添加订单
export const addOrders = (obj) => ajax(`http://${url}/ds/order`, obj, 'POST')
// 查看订单列表
export const ordersList = (obj) => ajax(`http://${url}/ds/order`, obj, 'GET')
// 支付订单
export const payOrders = (obj) => ajax(`http://${url}/ds/order`, obj, 'PUT')
// 获取支付状态
export const payStatus = (obj) => ajax(`http://${url}/ds/order/status`, obj, 'PATH')
// 用户删除订单
export const delOrders = (obj) => ajax(`http://${url}/ds/order`, obj, 'DELETE')

// 查看信息摘要
export const newDetail = (obj) => ajax(`http://${url}/ds/search/content`, obj, 'POST')

