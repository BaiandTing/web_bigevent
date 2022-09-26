$(function () {
    // 调用getUserInfo函数获取用户基本信息   
    getUserInfo()
    
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否需要退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },  
        function (index) {
            //do something
            // 1.清空本体存储的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录界面
            location.href = 'login.html'
            // 关闭 confirm 询问框
            layer.close(index);
        });        
    })
})


// 获取用户基本信息函数    
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar() 函数 渲染用户的头像
            renderAvatar(res.data)
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     // alert('ok')
        //     // console.log(res);
        //     // 在complete回调函数中可以使用 responseJSON 拿到服务器响应回来的数据
        //     // {"status":1,"message":"身份认证失败！"}
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录界面
        //         location.href = 'login.html'
        //     }
        // }
    })   
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的头像
    var name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        // toUpperCase 可以把字符(中文||英文)转换为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}