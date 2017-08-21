const forwardImg =  require('./assets/forward.png')
const backImg =  require('./assets/back.png')
let MyFinger = {}
MyFinger.install = (Vue, options) => {
    let installed = false
    let startDate,
        endDate,
        startX,
        startY,
        endX,
        endY,
        lockByBack = false,
        lockByForward = false,
        that
    // 前进后退的html展示
    let forwardTpl = Vue.extend({
        template: `<div class="forward-arrow" style="position: fixed; z-index: 9999; height: 0.8rem; right: 0.1rem; top: 50%; margin-top: -0.2rem;">
            <img src='${forwardImg}' style="height: 0.8rem; opacity: 0.8;" />
        </div>`
    })
    let forwardStr = new forwardTpl().$mount().$el
    let backTpl = Vue.extend({
        template: `<div class="back-arrow" style="position: fixed; z-index: 9999; height: 0.8rem; left: 0.1rem; top: 50%; margin-top: -0.2rem;">
            <img src='${backImg}' style="height: 0.8rem; opacity: 0.8;" />
        </div>`
    })
    let backStr = new backTpl().$mount().$el
    Vue.mixin({
        mounted() {
            that = this
            if (!installed) {
                installed = true
                document.addEventListener('touchstart', touchstart)
    
                function touchstart(event) {
                    startDate = new Date().getTime()
                    startX = event.changedTouches[0].clientX
                    startY= event.changedTouches[0].clientY
                    document.addEventListener('touchmove', touchmove)
                }
    
                function touchmove(event) {
                    document.addEventListener('touchend', touchend)
                    showInfo(event)
                }
    
                function touchend(event) {
                    removeArrow()
                    endDate = new Date().getTime()
                    endX = event.changedTouches[0].clientX
                    endY= event.changedTouches[0].clientY
                    let time = (endDate - startDate)/1000
                    let disX = endX - startX
                    let disY = Math.abs(endY - startY)
                    let forward = (time <= 0.5 && disX <= -50 && disY <=30) || (time >= 0.5 && disX <= -100 && disY <=30)
                    let back = (time <= 0.5 && disX >= 50 && disY <=30) || (time >= 0.5 && disX >= 100 && disY <=30)
                    // router前进返回
                    if (forward) {
                        that.$router.forward()
                    }
                    if (back) {
                        that.$router.back()
                    }
                    removeEvent()
                }
                function showInfo(event) {
                    endX = event.changedTouches[0].clientX
                    endY= event.changedTouches[0].clientY
                    let disX = endX - startX
                    let disY = Math.abs(endY - startY)
                    let forward = disX <= -100 && disY <=30
                    let back = disX >= 100 && disY <=30
                    if (disY >= 30) {
                        removeArrow()
                        removeEvent()
                    }
                    if (forward) {
                        lockByForward = true
                        document.body.appendChild(forwardStr)
                    }
                    if (!forward && lockByForward) {
                        lockByForward = false
                        document.getElementsByClassName('forward-arrow').length && document.body.removeChild(forwardStr)
                    }
                    if (back) {
                        lockByBack = true
                        document.body.appendChild(backStr)
                    }
                    if (!back && lockByBack){
                        lockByBack = false
                        document.getElementsByClassName('back-arrow').length && document.body.removeChild(backStr)
                    }
                }
                function removeEvent() {
                    document.removeEventListener('touchmove', touchmove)
                    document.removeEventListener('touchend', touchend)
                }
                function removeArrow() {
                    document.getElementsByClassName('forward-arrow').length && document.body.removeChild(forwardStr)
                    document.getElementsByClassName('back-arrow').length && document.body.removeChild(backStr)
                }
            }
        }
    })
}

export default MyFinger