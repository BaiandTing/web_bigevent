$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义一个美化时间的过滤器  ？未解决
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        // 2022-09-27 20:00:02
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据 默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                 //更新全部表单数据
                form.render()
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
            
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // layer.msg('获取分类数据成功！')
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-cate', res)
                // 通知layui 重新渲染表单区域的UI结构
                $('[name=cate_id]').html(htmlStr)
            }
        })
    }

    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',// 分页容器的 id
            count: total, // 总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            // 分页发生切换的时候 触发 jupm 回调  拿到页码值
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发 jump 回调
            // 2.只要调用了laypage.render() 方法，就会触发jump回调 导致了死循环
            jump: function (obj, first) {
                // 可以通过 first 的值来判断通过那种方式，触发的jump回调
                // 如果first的值是true ->是方式2 触发的 否则是 方式1 触发的
                // console.log(first);
                // console.log(obj.curr);//得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到q这个查询参数对象中 pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的 q 页码值 渲染表格数据
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len);
        // 获取到文章的id 通过自定义属性
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 询问用户是否要删除数据
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 删除完成后，需要判断这一页是否还有数据，没有的话让页码值-1，重新渲染数据
                    if (len === 1) {
                        // len === 1 删除后页面上没有任何数据了
                        // 页码值最小是1
                        q.pagenum = q.pagenum ===1 ? 1 : q.pagenum -1
                    }
                    initTable()
                    layer.close(index);
                }
            })
          });
    })


    // 编辑功能为未实现
        // 通过代理的方式，为编辑 btn-edit 表单绑定点击事件 
        // ? 不能获取到文章信息 直接在弹出框显示 未解决？
    var indexEdit = null
    $('tbody').on('click',"#btn-edit", function () {
        // console.log('ok');
        // 调用layer.open() 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 自定义属性获取 id  data-id
        var id = $(this).attr('data-id')
        // console.log(id);
        // 发起请求获取对应 文章分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                // console.log(res);
                // lay-filter="filter-edit" 快速获取表单的内容 
                // form.val('form-edit2', res.data)
                form.val('form-edit2',res.data)
            }
        })
    })
      
     // 通过代理的方式，为 form-edit2 修改分类的表单绑定submit事件
     $('body').on('submit', '#form-edit2', function (e) {
        e.preventDefault()
        //
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initTable()
            }
        })
    })
})