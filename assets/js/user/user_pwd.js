$(function () {
    var form = layui.form
    var layer = layui.layer

    // 自定义校验
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位,且不能出现空格'
        ],
        // samePwd  新旧密码不能相同 给新密码
        // value 把samePwd给谁 可以拿到这个文本框的值
        samePwd: function (value) {
            // $('[name=oldPwd]').val() 可以拿到name=oldPwd 的这个文本框的值
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 新密码和确认密码必须一致 给确认密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }

    })

    // 检测表单的提交行为
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                // 重置表单 $('.layui-form')[0] 把$('.layui-form') jQuery元素转换为 DOM 元素
                $('.layui-form')[0].reset()
            }
        })
    })
})