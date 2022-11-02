# 我的日常练习

## vue2响应式原理
此demo模拟实现了vue的数据劫持，双向绑定，数组对象原型方法代理。使用数据劫持结合发布订阅者模式。
为对象基本类型数类型追加get和set方法。为数组设置代理。重写了数组原型对象方法。并且在重写的方法里面调用了数组
本身的方法。不会影响数组原本的操作。
**2022/11/1 -- 新增简单{{}}模板编译及绑定，虚拟dom和真实dom转换**

1.引入myVue.js文件
#### html
```
		<div class="root">
			<div class="name">哈哈哈{{name}}</div>
			<div class="text">{{age}}</div>
			<button onclick="add()">姓名add</button>
			<button onclick="del()">年龄del</button>
		</div>
```

#### 实例化
```		
		const people = {
			name: 1,
			age: 12,
			parents: {
				dad: 'a',
				mom: 'b'
			},
			arr: ['d', 'e'],
			list: ['f', 'e']
		};
		new myVue(document.querySelector('.root'),people)

		function add() {
			people.name++
		}

		function del() {
			people.age--
		}
```
