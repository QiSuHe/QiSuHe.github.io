(function () {
    const CACHE_KEY = "release"
    const CACHE_TTL = 60 * 60 * 1000
    const FETCH_TIMEOUT = 15 * 1000

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
                    return
                }
            })
    }

    function render(data) {
        document.querySelector("main .app-desc").textContent = `Lastest: ${data.tag_name} (${bytesToMiB(data.assets[0].size)}MB)` || "Lastest: null"
        document.querySelector("a.download").href = `https://gh-proxy.org/${data.assets[0].browser_download_url}` || "https://www.lanzoul.com/b0ejgbfyf"
        document.querySelector("#update .app-logs").innerHTML = normalizeBody(data.body) || "修复了一些已知问题"
    }

    document.addEventListener("DOMContentLoaded", async () => {
        init()
    })
})()