// 注意：每次调用$.get()  $.post()  .$.ajax()的时候 
// 会先调用 ajaxPrefilter 函数  可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    // 在发起真正的Ajax 之前 统一拼接请求的根路径
    // options.url = 'http://www.liulongbin.top:3007' + options.url
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url);

    //统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在complete回调函数中可以使用 responseJSON 拿到服务器响应回来的数据
            // {"status":1,"message":"身份认证失败！"}
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
                // 1.强制清空 token
                localStorage.removeItem('token')
                // 2.强制跳转到登录界面
                location.href = 'login.html'
            }
    }
})