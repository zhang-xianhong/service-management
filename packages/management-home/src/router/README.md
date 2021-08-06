#router-json

##router
        path<string>                路径
        redirect<string>            重定向 
        component<VNode>            组件
        children Array<router>      子路由
        meta<meta>                  题头对象
        name<string>                路由名称  *必选项

##meta
        hidden<boolen>              是否在左边栏隐藏，true隐藏
        isRootLevel<boolen>         是否左边栏顶级节点，router数组直接对象中，必为true
        icon<string>                图标
        title<string>               左边栏标题
        id<string | number>         权限信息，非必填，有此属性则开启页面权限校验,不填写默认放过鉴权
        activeMenu<string>          XX详情页保证激活菜单不丢失的参数，从根路由/写到XX-list
        node<boolen>                是否为节点
