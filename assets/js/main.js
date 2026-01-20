document.addEventListener("DOMContentLoaded", async () => {
    initAppVersion()
    initBackToTop()
    initLanguage()
    initCounters()
    initAppTheme()
    initQRcode()

    let previousClass = document.documentElement.className
    const observerHtml = new MutationObserver(() => {
        const currentClass = document.documentElement.className
        if (currentClass !== previousClass) {
            previousClass = currentClass
            initQRcode()
        }
    })
    observerHtml.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
    })
})


/* 过渡动画 */
function initCounters() {
    const counters = document.querySelectorAll("#stats .number")
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target
                const target = parseInt(counter.getAttribute("data-target"))
                const isPercentage = counter.getAttribute("data-stat") == "rate"
                const duration = 999
                const increment = target / (duration / 16)

                let current = 0
                const timer = setInterval(() => {
                    current += increment
                    if (current >= target) {
                        current = target
                        clearInterval(timer)
                    }

                    const formattedNumber = Math.floor(current).toLocaleString()
                    counter.textContent = formattedNumber + (isPercentage ? "%" : "+")
                }, 16)

                counterObserver.unobserve(counter)
            }
        })
    }, { threshold: 0.5 })

    counters.forEach(counter => {
        counterObserver.observe(counter)
    })
}


/* 返回顶部 */
function initBackToTop() {
    const backToTopButton = document.querySelector("#back-to-top")
    const topBarLogoButton = document.querySelector("#top-bar .logo")

    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            if (window.scrollY < 520) {
                backToTopButton.style.display = "none"
            } else {
                backToTopButton.style.display = "block"
            }
        })

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
        topBarLogoButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        })
    }
}


/* 主题模式 */
function initAppTheme() {
    const themeModeItem = document.querySelectorAll("#top-bar .theme .item")
    const themeModeIcon = document.querySelector("#top-bar .mode")
    const themeMode = document.querySelector("#top-bar .theme")
    let nowTheme = localStorage.getItem("theme") || "auto"

    if (nowTheme == "light") {
        themeModeIcon.icon = "light_mode--outlined"
    } else if (nowTheme == "dark") {
        themeModeIcon.icon = "dark_mode--outlined"
    } else {
        themeModeIcon.icon = "contrast--outlined"
    }

    mdui.setTheme(nowTheme)
    themeMode.value = nowTheme
    localStorage.setItem("theme", nowTheme)

    themeModeItem.forEach(item => {
        item.addEventListener("click", (e) => {
            if (item.hasAttribute("selected")) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            nowTheme = e.currentTarget.getAttribute("value")
            mdui.setTheme(nowTheme)
            localStorage.setItem("theme", nowTheme)
            if (nowTheme == "light") {
                themeModeIcon.icon = "light_mode--outlined"
            } else if (nowTheme == "dark") {
                themeModeIcon.icon = "dark_mode--outlined"
            } else {
                themeModeIcon.icon = "contrast--outlined"
            }
        })
    })
}


/* 显示语言 */
function getSystemLanguage() {
    const lang = (navigator.language || navigator.userLanguage || "zh").toLowerCase()
    if (lang.startsWith("zh")) {
        return "zh-cn"
    }
    return "en-us"
}

function applyLocale(locale) {
    const data = i18n[locale]
    if (data) {
        document.title = data.title
        const description = document.querySelector("meta[name='description']")
        if (description) {
            description.setAttribute("content", data.description)
        }
        document.querySelectorAll("[data-i18n]").forEach(ele => {
            const key = ele.getAttribute("data-i18n")
            if (data[key]) {
                ele.textContent = data[key]
            }
        })
    }
}

function initLanguage() {
    const localeItem = document.querySelectorAll("#top-bar .locale .item")
    const localeMode = document.querySelector("#top-bar .locale")
    let nowLocale = localStorage.getItem("locale") || getSystemLanguage() || "zh-cn"

    localeMode.value = nowLocale
    localStorage.setItem("locale", nowLocale)
    applyLocale(nowLocale)

    localeItem.forEach(item => {
        item.addEventListener("click", (e) => {
            if (item.hasAttribute("selected")) {
                e.preventDefault()
                e.stopPropagation()
                return
            }
            nowLocale = e.currentTarget.getAttribute("value")
            localStorage.setItem("locale", nowLocale)
            applyLocale(nowLocale)
        })
    })
}


/* 生成二维码 */
function generateQRcode(url, ele, color) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|Opera Mini|Mobile/i.test(navigator.userAgent)
    const qrcode = ele.querySelector(".qrcode")
    qrcode.innerHTML = ""
    ele.disabled = true

    try {
        new QRCode(qrcode, {
            text: url.href,
            width: 666,
            height: 666,
            colorDark: color,
            colorLight: "rgba(0,0,0,0)",
            correctLevel: QRCode.CorrectLevel.L,
        })
    } catch (err) {
        console.error(err)
    }

    setTimeout(() => {
        const canvas = qrcode.querySelector("canvas")
        const image = qrcode.querySelector("canvas+img")
        if (image) {
            image.style.width = "144px"
            image.style.height = "144px"
        }
        if (canvas && !isMobile) ele.disabled = false
    }, 321)
}

function getqrcodeColor() {
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    if (mdui.getTheme() == "dark") {
        return "#ffffff"
    } else if (mdui.getTheme() == "auto" && isDark) {
        return "#ffffff"
    } else {
        return "#000000"
    }
}

function initQRcode() {
    const download_url = document.querySelector("a#download")
    const download_tips = document.querySelector("mdui-tooltip:has(#download)")
    if (download_url && download_tips) generateQRcode(download_url, download_tips, getqrcodeColor())

    const releases_url = document.querySelector("a#releases")
    const releases_tips = document.querySelector("mdui-tooltip:has(#releases)")
    if (releases_url && releases_tips) generateQRcode(releases_url, releases_tips, getqrcodeColor())
}

window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        initQRcode()
    })


/* 获取应用版本 */
function initAppVersion() {
    const CACHE_KEY = "release"
    const CACHE_TTL = 10 * 60 * 1000
    const FETCH_TIMEOUT = 10 * 1000

    const API_URL = "https://api.github.com/repos/qisuhe/qisuhe.github.io/releases/latest"

    function bytesToMiB(bytes) {
        return (bytes / 1024 / 1024).toFixed(2)
    }

    function normalizeBody(text) {
        if (!text) return null

        return text
            .replace(/\r\n/g, "\n")
            .replace(/\n\s*<br>\s*\n/g, "\n\n")
            .replace(/<br\s*\/?>/gi, "")
            .replace(/\n/g, "<br>")
    }

    function readRawCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY)
            return raw ? JSON.parse(raw) : null
        } catch (e) {
            return null
        }
    }

    function getValidCache() {
        const cache = readRawCache()
        if (!cache || !cache.timestamp || !cache.data) return null
        if (Date.now() - cache.timestamp > CACHE_TTL) return null
        return cache.data
    }

    function getAnyCache() {
        const cache = readRawCache()
        return cache && cache.data ? cache.data : null
    }

    function setCache(data) {
        try {
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    timestamp: Date.now(),
                    data: data
                })
            )
        } catch (e) { }
    }

    function fetchWithTimeout(url, timeout) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController()
            const timer = setTimeout(() => {
                controller.abort()
                reject(new Error("Fetch Timeout"))
            }, timeout)

            fetch(url, {
                signal: controller.signal,
                headers: {
                    "Accept": "application/vnd.github+json"
                }
            })
                .then((res) => {
                    clearTimeout(timer)
                    if (!res.ok) {
                        reject(new Error("HTTP " + res.status))
                        return
                    }
                    resolve(res.json())
                })
                .catch((err) => {
                    clearTimeout(timer)
                    reject(err)
                })
        })
    }

    function init() {
        const validCache = getValidCache()
        if (validCache) {
            render(validCache)
            return
        }

        fetchWithTimeout(API_URL, FETCH_TIMEOUT)
            .then((data) => {
                setCache(data)
                render(data)
            })
            .catch((err) => {
                const anyCache = getAnyCache()
                if (anyCache) {
                    render(anyCache)
                } else {
                    render()
                }
                return
            })
    }

    function render(data) {
        setTimeout(() => {
            const p = document.querySelector("#preloader")
            if (p) p.remove()
        }, 321)
        document.querySelector("main .app-desc").textContent = `${data.tag_name} | ${bytesToMiB(data.assets[0].size)}MB | ${data.published_at.split("T")[0]}` || "Technology for a Convenient Life"
        document.querySelector("#download").href = `https://gh-proxy.org/${data.assets[0].browser_download_url}` || "https://www.123pan.com/s/ikkrVv-jpVQh"
        document.querySelector("#update .app-logs").innerHTML = normalizeBody(data.body) || "修复了一些已知问题"
        initQRcode()
    }

    init()

}
