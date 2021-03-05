#router-json

##router
        path<string>                路径
        redirect<string>            重定向 
        component<VNode>            组件
        children Array<router>      子路由
        meta<meta>                  题头对象

##meta
        hidden<boolen>              是否在左边栏隐藏，true隐藏
        isRootLevel<boolen>         是否左边栏顶级节点，router数组直接对象中，必为true
        icon<string>                图标
        title<string>               左边栏标题
