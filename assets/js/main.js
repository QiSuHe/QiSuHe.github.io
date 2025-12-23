document.addEventListener("DOMContentLoaded", async () => {
    initAppTheme()
    initCounters()
    initBackToTop()
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
                const duration = 1500
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
    const backToTopButton = document.getElementById("back-to-top")

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
    }
}


/* 主题模式 */
function initAppTheme() {
    const themeModeItem = document.querySelectorAll("#top-bar .mode .item")
    const themeMode = document.querySelector("#top-bar .mode")
    let nowTheme = localStorage.getItem("theme")

    if (!nowTheme || nowTheme == "auto") {
        mdui.setTheme("auto")
        themeMode.setAttribute("value", "auto")
        localStorage.setItem("theme", "auto")
    } else {
        mdui.setTheme(nowTheme)
        themeMode.setAttribute("value", nowTheme)
        localStorage.setItem("theme", nowTheme)
    }

    themeModeItem.forEach(item => {
        item.addEventListener("click", (e) => {
            nowTheme = e.currentTarget.getAttribute("value")
            mdui.setTheme(nowTheme)
            localStorage.setItem("theme", nowTheme)
        })
    })
}