/*
 * @Author: donglei
 * @Date: 2021-12-10 21:44:35
 * @LastEditors: donglei
 * @LastEditTime: 2021-12-10 21:44:36
 * @Description: file content
 * @FilePath: \myPlugins\canvas时钟插件\Clock.js
 */

/*
 * @Author: donglei
 * @Date: 2021-12-10 20:42:18
 * @LastEditors: donglei
 * @LastEditTime: 2021-12-10 21:42:06
 * @Description: file content
 * @FilePath: \TEST\canvas练习\时钟封装.js
 */

/* 
    new Clock('#canvas',{
        width:400,
        height:400，
    })
*/


function Clock(selector, options) {
    // 获取元素
    let cvs = typeof selector === 'object' ? selector : document.querySelector(selector)
    let width = options && options.width ? options.width : 400
    let height = options && options.height ? options.height : 400
    let min = width < height ? width : height

    function init() {
        cvs.width = width
        cvs.height = height
    }
    init()

    // 检测方法
    if (cvs.getContext) {
        let ctx = cvs.getContext('2d')

        // cvs的宽高应该与页面同高
        // function init() {
        //     width = document.documentElement.clientWidth
        //     height = document.documentElement.clientHeight
        //     cvs.width = width
        //     cvs.height = height
        // }

        // 计算宽高
        // 修改坐标点
        ctx.translate(width / 2, height / 2)
        // 视口大小修改后 重新设置cvs的大小和坐标原点
        // window.onresize = function () {
        //     init()
        //     ctx.translate(w / 2, h / 2)
        // }

        // 按每秒60次重绘
        setInterval(() => {
            drawClock(ctx)
        }, 1000 / 60);

        // 绘制时钟
        function drawClock(ctx) {
            // 清除全部图案
            ctx.clearRect(-width / 2, -height / 2, width, height)
            // 绘制背景颜色
            ctx.fillStyle = '#f8d86a'
            ctx.fillRect(-width / 2, -height / 2, width, height)
            // 获取当前时间
            let time = new Date()
            let h = time.getHours()
            let m = time.getMinutes()
            let s = time.getSeconds()

            // 绘制内圆
            ctx.beginPath()
            ctx.lineWidth = 5
            ctx.strokeStyle = '#b7ae8f'
            ctx.moveTo(min / 2 - min * 0.05, 0)
            ctx.arc(0, 0, min / 2 - min * 0.05, 0, Math.PI / 180 * 360, true)
            ctx.stroke()

            // 绘制外圆
            ctx.beginPath()
            ctx.lineWidth = 5
            ctx.moveTo(min / 2 - min / 2 * 0.01, 0)
            ctx.arc(0, 0, min / 2 - min / 2 * 0.01, 0, Math.PI / 180 * 360, true)
            ctx.stroke()
            // 绘制时钟刻度
            let hourDeg = 30
            for (let i = 0; i < 12; i++) {
                let startX = (min / 2 - min / 2 * 0.2) * Math.cos(Math.PI / 180 * hourDeg * i)
                let startY = (min / 2 - min / 2 * 0.2) * Math.sin(Math.PI / 180 * hourDeg * i)
                let endX = (min / 2 - min / 2 * 0.12) * Math.cos(Math.PI / 180 * hourDeg * i)
                let endY = (min / 2 - min / 2 * 0.12) * Math.sin(Math.PI / 180 * hourDeg * i)
                ctx.beginPath()
                ctx.lineWidth = 5
                ctx.lineCap = 'round'
                ctx.strokeStyle = '#1a3b32'

                ctx.moveTo(startX, startY)
                ctx.lineTo(endX, endY)
                ctx.stroke()
            }

            // 绘制分针刻度
            let minDeg = 6
            for (let i = 0; i < 60; i++) {
                if (i % 5 === 0) continue
                let startX = (min / 2 - min / 2 * 0.15) * Math.cos(Math.PI / 180 * minDeg * i)
                let startY = (min / 2 - min / 2 * 0.15) * Math.sin(Math.PI / 180 * minDeg * i)
                let endX = (min / 2 - min / 2 * 0.12) * Math.cos(Math.PI / 180 * minDeg * i)
                let endY = (min / 2 - min / 2 * 0.12) * Math.sin(Math.PI / 180 * minDeg * i)
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.lineCap = 'round'
                ctx.strokeStyle = '#5bae23'
                ctx.moveTo(startX, startY)
                ctx.lineTo(endX, endY)
                ctx.stroke()
            }
            // 绘制时间文本
            function drawText() {
                // 绘制文本外框
                ctx.fillStyle = '#ccccd6'
                ctx.fillRect(-55, 77, 110, 30)

                let hStr = h.toString().padStart(2, '0')
                let mStr = m.toString().padStart(2, '0')
                let sStr = s.toString().padStart(2, '0')
                let timeStr = `${hStr}:${mStr}:${sStr}`
                let fs = 100
                ctx.font = '100px bold Monospace'
                ctx.fillStyle = '#322f3b'
                while (ctx.measureText(timeStr).width > 100) {
                    fs--
                    ctx.font = fs + 'px bold Monospace'
                }
                ctx.textAlign = 'center'
                ctx.textBaseLine = 'middle'
                ctx.fillText(timeStr, 0, 100)
            }
            if (min >= 300) {
                drawText()
            }
            // 绘制指针
            function drawTime() {

                // 时针每小时经过30deg 分针每分钟使时针经过30/60deg 秒针每秒使时针经过30/60/60deg
                let hourDeg = h * 30 + m * 30 / 60 + s * 30 / 60 / 60
                let hourX = (min / 2 - min / 2 * 0.5) * Math.cos(Math.PI / 180 * (hourDeg - 90))
                let hourY = (min / 2 - min / 2 * 0.5) * Math.sin(Math.PI / 180 * (hourDeg - 90))
                // 分针每分钟使分针经过360/60deg 秒针每秒使分针经过360/60/60deg
                let minDeg = m * 6 + s * 6 / 60
                let minX = (min / 2 - min / 2 * 0.4) * Math.cos(Math.PI / 180 * (minDeg - 90))
                let minY = (min / 2 - min / 2 * 0.4) * Math.sin(Math.PI / 180 * (minDeg - 90))
                // 秒针每秒使秒针经过360/60deg
                let secDeg = s * 6
                let secX = (min / 2 - min / 2 * 0.3) * Math.cos(Math.PI / 180 * (secDeg - 90))
                let secY = (min / 2 - min / 2 * 0.3) * Math.sin(Math.PI / 180 * (secDeg - 90))
                // 绘制指针
                ctx.beginPath()
                // 绘制时针
                ctx.moveTo(0, 0)
                ctx.strokeStyle = 'black'
                ctx.lineWidth = 5
                ctx.lineCap = 'round'
                ctx.lineTo(hourX, hourY)
                ctx.stroke()
                // 绘制分针
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.lineWidth = 3
                ctx.strokeStyle = '#475164'
                ctx.lineTo(minX, minY)
                ctx.stroke()
                // 绘制秒针
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.strokeStyle = '#1781b5'
                ctx.lineWidth = '1'
                ctx.lineTo(secX, secY)
                ctx.stroke()

                // 绘制中心点
                ctx.beginPath()
                ctx.moveTo(5, 0)
                ctx.strokeStyle = 'black'
                ctx.arc(0, 0, 5, 0, Math.PI / 180 * 360, true)
                ctx.closePath()
                ctx.fillStyle = 'black'
                ctx.fill()
            }
            drawTime()
        }
    } else {
        console.error('浏览器不支持canvas.getContext()方法')
    }
}