module.exports = {
    title: "Yesccx's Blog",
    description: '向来心是看客心，奈何人是剧中人',
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ["meta", { name: "robots", content: "all" }],
        ["meta", { name: "author", content: "yesccx" }],
        ['meta', { name: 'keywords', content: 'yesccx,yesccxblog,blog,vuepress-blog' }],

    ],
    markdown: {
        lineNumbers: true
    },
    theme: 'reco',
    themeConfig: require('./config/theme/index.js'),
    plugins: require('./config/plugins/index')
}