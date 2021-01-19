module.exports = {
    nav: require('./config/nav'),
    // friendLink: require('./config/link'),
    type: 'blog',
    smoothScroll: true,
    author: 'yesccx', // 作者
    blogConfig: { // 博客设置
        category: {
            location: 2, // 在导航栏菜单中所占的位置，默认2
            text: '分类' // 默认 “分类”
        },
        tag: {
            location: 3, // 在导航栏菜单中所占的位置，默认3
            text: '标签' // 默认 “标签”
        }
    },
    authorAvatar: '/avatar.png',
    lastUpdated: '上次更新时间', // 最后更新时间 string | boolean
    repo: 'yesccx',
    docsDir: 'docs', // 如果你的文档不在仓库的根部
    docsBranch: 'source', // 可选，默认为 master
    editLinks: false,
    startYear: '2020', // 项目开始时间
    logo: '/avatar.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    sidebar: 'auto', // 自动形成侧边导航
    // 备案信息
    // record: '粤ICP备20036386号-1',
    // recordLink: 'http://www.beian.miit.gov.cn/',
    // cyberSecurityRecord: '粤公网安备 44060602001609号',
    // cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44060602001609',
};