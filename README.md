前端 README
项目概述
通讯录管理系统前端是一个现代化的Web界面，提供联系人管理、收藏功能、多联系方式管理和数据导入导出功能。

技术栈
HTML5 - 页面结构

CSS3 - 样式设计，包括Flexbox和Grid布局

JavaScript (ES6+) - 交互逻辑

Font Awesome 6.4.0 - 图标库

原生Fetch API - 与后端通信

功能特性
已实现功能
联系人管理

添加、编辑、删除联系人

实时搜索联系人

按收藏状态筛选

收藏功能

星形图标切换收藏状态

收藏联系人特殊标记

收藏筛选视图

多联系方式管理

动态添加/删除联系方式

支持电话、邮箱、微信、地址等多种类型

联系类型图标化展示

数据导入导出

一键导出为Excel格式

从Excel文件导入数据

导入导出进度反馈

用户体验

响应式设计，适配移动端和桌面端

平滑的动画过渡效果

实时的通知反馈

表单验证和错误提示

项目结构
text
frontend/
├── index.html          # 主页面文件
├── style.css          # 样式文件
├── script.js          # JavaScript逻辑文件
├── assets/            # 静态资源文件夹
│   ├── icons/         # 图标文件
│   └── images/        # 图片文件
└── README.md          # 前端文档
文件说明
index.html
主页面文件，包含以下主要部分：

顶部导航栏（标题、导入/导出按钮、添加联系人按钮）

搜索和筛选区域

联系人卡片网格容器

添加/编辑联系人模态框

style.css
样式文件，包含以下主要模块：

全局样式 - 重置样式、容器布局

头部样式 - 导航栏、按钮样式

筛选区域 - 搜索框、筛选标签

联系人网格 - 卡片布局、悬停效果

模态框 - 表单样式、动画效果

响应式设计 - 移动端适配

script.js
JavaScript逻辑文件，包含以下主要类和方法：

AddressBook 类
javascript
class AddressBook {
    constructor()          // 初始化应用
    init()                // 初始化事件绑定和数据加载
    bindEvents()          // 绑定所有DOM事件
    loadContacts()        // 从后端加载联系人数据
    renderContacts()      // 渲染联系人卡片
    createContactCard()   // 创建单个联系人卡片HTML
    bindContactCardEvents() // 绑定卡片上的事件
    showModal()           // 显示添加/编辑模态框
    hideModal()           // 隐藏模态框
    fillForm()            // 填充表单数据
    createContactMethodInput() // 创建联系方式输入框
    addContactMethod()    // 添加联系方式字段
    saveContact()         // 保存联系人（新增/编辑）
    editContact()         // 编辑联系人
    toggleFavorite()      // 切换收藏状态
    deleteContact()       // 删除联系人
    filterContacts()      // 筛选联系人
    exportContacts()      // 导出联系人
    importContacts()      // 导入联系人
    showNotification()    // 显示通知消息
}
安装与运行
前置要求
现代浏览器（Chrome 90+、Firefox 88+、Safari 14+）

本地运行需要启动后端服务（默认端口5000）

运行步骤
克隆项目到本地

确保后端服务正在运行（默认 http://localhost:5000）

直接在浏览器中打开 index.html，或使用本地服务器：

bash
# 使用Python启动简单HTTP服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server .
在浏览器中访问 http://localhost:8000

API接口说明
前端通过以下API与后端通信：

联系人相关
GET /api/contacts - 获取所有联系人

POST /api/contacts - 添加新联系人

PUT /api/contacts/:id - 更新联系人

DELETE /api/contacts/:id - 删除联系人

PUT /api/contacts/:id/favorite - 切换收藏状态

数据操作
GET /api/export - 导出联系人到Excel

POST /api/import - 从Excel导入联系人

自定义配置
修改API地址
如果需要修改后端API地址，请编辑 script.js 文件中的 baseUrl：

javascript
// 第4行，修改为你的后端地址
this.baseUrl = 'http://localhost:5000/api';
添加新的联系方式类型
要添加新的联系方式类型，需要修改以下文件：

script.js - 更新联系方式选项

javascript
// 在 createContactMethodInput 方法中，修改select选项
<select class="method-type">
    <option value="phone">电话</option>
    <option value="email">邮箱</option>
    <option value="wechat">微信</option>
    <option value="address">地址</option>
    <!-- 添加新选项 -->
    <option value="new_type">新类型</option>
</select>
script.js - 更新图标映射

javascript
// 在 createContactCard 方法中，添加图标映射
const iconMap = {
    phone: 'fas fa-phone',
    email: 'fas fa-envelope',
    wechat: 'fab fa-weixin',
    address: 'fas fa-map-marker-alt',
    new_type: 'fas fa-new-icon'  // 添加新图标
};
响应式设计
系统支持以下屏幕尺寸：

桌面端（≥ 768px）
三列网格布局

完整导航栏

所有功能可见

移动端（< 768px）
单列布局

垂直导航栏

简化表单布局

触摸友好的按钮尺寸

浏览器兼容性
浏览器	版本	支持情况
Chrome	90+	✅ 完全支持
Firefox	88+	✅ 完全支持
Safari	14+	✅ 完全支持
Edge	91+	✅ 完全支持
IE	11	⚠️ 部分支持（需要polyfill）
开发指南
添加新功能
在HTML中添加必要的DOM元素

在CSS中添加样式规则

在JavaScript中添加事件处理逻辑

如果需要，与后端API对接

调试提示
使用浏览器开发者工具（F12）

查看控制台错误信息

使用网络面板监控API请求

检查元素面板查看DOM结构和样式

代码规范
使用有意义的变量和函数名

添加必要的注释

保持函数单一职责

错误处理要完善

故障排除
常见问题
无法连接到后端

检查后端服务是否运行：http://localhost:5000

检查CORS配置是否正确

查看浏览器控制台是否有网络错误

页面样式错乱

检查CSS文件是否正常加载

清除浏览器缓存（Ctrl+F5）

检查CSS选择器是否正确

表单提交失败

检查所有必填字段是否填写

查看控制台的错误信息

检查API返回的状态码

导入/导出功能异常

检查文件格式是否为.xlsx或.xls

检查文件大小是否过大

检查网络连接是否正常

调试命令
javascript
// 在控制台调试AddressBook实例
const addressBook = new AddressBook();
console.log(addressBook.contacts);

// 手动触发数据加载
addressBook.loadContacts();
未来计划
待添加功能
联系人分组 - 按公司、职位等分组

批量操作 - 批量删除、批量导出

数据统计 - 联系人数量统计、分类统计

主题切换 - 深色/浅色主题

离线支持 - 使用LocalStorage缓存数据

数据备份 - 自动备份和恢复

联系人分享 - 生成联系人分享链接

优化计划
性能优化 - 虚拟滚动长列表

用户体验 - 更丰富的动画效果

可访问性 - 更好的屏幕阅读器支持

国际化 - 多语言支持

PWA支持 - 转换为渐进式Web应用

贡献指南
Fork本仓库

创建功能分支：git checkout -b feature/your-feature

提交更改：git commit -m 'Add some feature'

推送到分支：git push origin feature/your-feature

提交Pull Request

许可证
本项目采用MIT许可证。详见LICENSE文件。

联系方式
如有问题或建议，请通过以下方式联系：

邮箱：dev@example.com

项目地址：https://github.com/your-team/address-book-system

问题反馈：在GitHub仓库提交Issue

注意：本项目为前端部分，需要配合后端服务运行。后端代码和配置请参考后端README文档。
