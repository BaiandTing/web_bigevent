$(function () {
    // 点击 "去注册账号" 的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击 "去登录" 的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    // 从 layui 中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过  form.verify() 函数 自定义校验规则
    form.verify({
        'pwd':[
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到确认密码框里的值
            // 需要拿到密码框里的值，两者对比判断
            // 如果失败 不一致 则return一个错误信息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data,
             function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                // console.log('注册成功');
                layer.msg('注册成功,请登录!')
                // 模拟人的点击行为
                $('#link_login').click()
            })
    })

    // 监听登录表单的提交数据
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // console.log(res.token);
                // 登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token',res.token)
                // 跳转到后台主页
                location.href= 'index.html'
            }
        })
    })
})