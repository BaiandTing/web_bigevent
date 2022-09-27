$(function () {
    var form = layui.form
    var layer = layui.layer

    // 自定义正则表达式 限制用户输入的格式
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1~6 个字符之间！'
            }
        }
    })

    // 初始化用户的基本信息
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnRest').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // $(this).serialize() 表单序列化 可以快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})