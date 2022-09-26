// 注意：每次调用$.get()  $.post()  .$.ajax()的时候 
// 会先调用 ajaxPrefilter 函数  可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    // 在发起真正的Ajax 之前 统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})