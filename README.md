# wxAppTodos
&emsp;&emsp;[todomvc](http://www.todomvc.com)提供了在当今大多数流行的JavaScript MV*框架概念实现的相同的Todo应用程序，觉得这个小项目挺有意思，最近在学习微信小程序，故用小程序做一版Todo（默认你已知道Todo的基本功能）。

### 创建小程序项目
&emsp;&emsp;初始的申请账号、安装开发工具、新建小程序项目以及基础文档部分，建议读者自行研读[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/)

### 小程序特色
- 标签
世上再无div，无人爱我基友p。
1.视图容器
&emsp;&emsp;view ，scroll-view ，swiper ，movable-view ，cover-view
2.基础内容
&emsp;&emsp;icon ，text ，rich-text ，progress
3.表单组件
&emsp;&emsp;button ，checkbox(checkbox-group) ，from ，input ，label ，picker ，picker-view ，radio(radio-group) ，slider ，switch ，textarea
4.导航
&emsp;&emsp;navigator
5.媒体组件
&emsp;&emsp;audio ，image ，video ，camera ，live-player ，live-pusher
6.地图
&emsp;&emsp;map
7.画布
&emsp;&emsp;canvas

- 标签属性
以下重点说明本Todo中使用到的，其他具体请移步[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component)
1.input的placeholder的样式，有专门的属性 placeholder-class，如下：
```input
<input placeholder-class="phcolor" placeholder='What needs to be done?' focus="{{focus}}" value="{{ inputVal }}" />
```
2.checkbox及for循环：
checkbox的状态变换，无法直接操作checkbox，需要在checkbox-group上面操作，
wx:for循环需加上wx:key
```checkbox
<view class="" wx:for="{{ showLists }}" wx:key="index">  
    <checkbox-group bindchange="checked" data-id="{{item.id}}">
      <checkbox value="{{ item.value }}" checked="{{ item.check }}"></checkbox>
    </checkbox-group>
</view>
```	
3.hidden属性：隐藏标签，标签全可用
```hidden
	<view hidden="{{ hidden }}"></view>
```
4.自定义属性：data-  
```data-
<text data-type="all" class="{{  dataType=='all'?'on':''  }}" bindtap="changeType">All</text>
changeType(e){
	//js中获取data-type的值
	let dataType = e.target.dataset.type
}
```
- js方面
1.data:{}中的数据变更后，必须使用this.setData()来更新数据
```setData
data:{ dataType:'all' },
changeType(e) {
	let type = e.target.dataset.type
	this.setData({ dataType: type })
}
```
2.模拟双击效果：通过两次点击的时间长短来判断是否为双击
```doubleTap
doubleTap(e){
	let curTime = e.timeStamp
	let lastTime = this.data.lastTapDiffTime
    let that = this
    if (lastTime > 0) {
      if (curTime - lastTime < 300) {
        console.log('双击')
      }
    }
}
```
