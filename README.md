# web-resource

项目静态资源目录可根据不同业务结构进行调整。  
下面只是个人当前的一个项目

###静态目录结构
<dl>
<dt>css</dt>
<dd>common</dd>
<dd>*业务快名称</dd>
<dd>...</dd>
<dt>img</dt>
<dd>common</dd>
<dd>*业务快名称</dd>
<dd>...</dd>
<dt>js</dt>
<dd>core - 为核心基类</dd>
<dd>ctrl - 为业务组件</dd>
<dd>plugs - 为外部插件</dd>
<dd>utils - 为工具类</dd>
<dd>v - 为自写常用组件</dd>
<dl>

### css部分
commom 包括 normalize.css 本土化重置加入常用工具类等构成 base.css  
animate.css 包括最常用的数十种css3动画效果  
pub_init.css 为具体业务组件依赖样式

### js部分
* core  包括  
    jquery， require， zepto

* ctrl  包括  
    public_module_init  
    jweixin-1.0.0  
    intro 公共引导  
    footer 公共尾等  

* plugs  收录  
    artDialog 弹出框  
    artTemplate 前端模板  
    backbone MVC  
    flexslider 幻灯片  
    jpages 分页  
    jplayer 播放器  
    jscrollpane 自定义滚动  
    lazyload 延迟加载  
    lightbox 大图预览  
    masonry 瀑布流  
    menu-anim 亚马逊 行为预判 菜单  
    tipsy   tooltip 提示  
    validation 表单验证  

* utils  收录  
    ZeroClipboard 复制  
    respond media query 兼容  
    transition 判断css动画兼容  
    touch zepto 触屏事件  
    json2 json支持  
    jquery.mousewheel 鼠标滚动事件  
    jquery.easing 动画效果拓展  
    jquery.cookie cookie 操作    
    html5shiv html5 语义化标签兼容  
    hammer 全功能触屏操作
* v

### 其他
根据项目需要推荐使用 normalize.css、 bootstrap、animate.css 等组件

js部分推荐使用模块化加载

自动化构建使用 grunt 或 gulp
