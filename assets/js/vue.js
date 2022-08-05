Vue.config.productionTip = false
const vm = new Vue({
    data() {
        return {
            name: '暮光壁纸',
            logo: 'https://s1.ax1x.com/2022/08/04/vmmySH.png',
            version: 'v2.3.25',
            downloads: [
                {
                    name: '蓝奏云',
                    url: 'https://wwa.lanzoui.com/itWwd05exy7e'
                },
                {
                    name: '123网盘',
                    url: 'https://www.123pan.com/'
                }
            ],
            contact: [
                {
                    icon: 'ri-message-3-line',
                    name: '商务合作',
                    url: 'http://wpa.qq.com/msgrd?v=3&uin=2471923911&site=qq&menu=yes'
                },
                {
                    icon: 'ri-account-pin-circle-line',
                    name: '关于我们',
                    url: 'https://space.bilibili.com/476467975'
                }
            ],
            friends: [
                {
                    name: '柒伍七の鱼',
                    url: 'https://s757129.github.io',
                    gap: '|'
                },
                {
                    name: '油猴中文网',
                    url: 'https://bbs.tampermonkey.net.cn/?fromuid=27974',
                    gap: '|'
                },
                {
                    name: '脚本猫',
                    url: 'https://scriptcat.org/search',
                    gap: ''
                }
            ]
        }
    }
})
vm.$mount('#root')