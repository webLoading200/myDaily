const ArrayProto = Array.prototype; //获取数组的原型对象
const arrayMethods = Object.create(ArrayProto); //创建对象
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
	const original = ArrayProto[method]; //获取对象属性方法
	Object.defineProperty(arrayMethods, method, { //为每个方法设置代理
		value: function mutator(...args) {
			console.log('mutator:', this, args);
			this._ob_.notify();
			return original.apply(this, args); //调用数组本身的方法，并将this指向当前调用者。
		},
		enumerable: false,
		writable: true,
		configurable: true
	})
})

function def(obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enumerable,
		writable: true,
		configurable: true
	})
}
class Observer {
	constructor(value) {
		//判断是否为数组、数组则将拦截器挂在数组原型对象上面。非数组则添加get和set方法
		if (Array.isArray(value)) {
			this.dep = new Dep(value);
			value.__proto__ = arrayMethods;
		} else {
			this.walk(value);
		}
	}
	walk(obj) {
		for (const [key, value] of Object.entries(obj)) {
			defineReactive(obj, key, value);
		}
	}
}

function defineReactive(data, key, val) {
	//为所有属性添加get和set方法，并将引用类型属性递归
	let dep = new Dep(key);
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get: function() {
			// 读取 data[key] 时触发
			dep.depend(key);
			return val;
		},
		set: function(newVal) {
			// 修改 data[key] 时触发
			if (val === newVal) {
				return;
			}
			val = newVal;
			dep.notify(key, newVal);
		}
	})
	if (typeof val == 'object') {
		def(val, '_ob_', dep);
		new Observer(val);
	}


}
/*******************************************/
class Dep {
	constructor(name) {
		this.name = name
		this.subs = [];
	}
	addSub(sub) {
		if (window.target) {
			console.log(window.temp)
			for (let i = 0; i < this.subs.length; i++) {
				if (this.subs[i].target == window.target) {
					this.subs.splice(i, 1);
				}
			}
			let d = {
				target: window.target,
				temp: window.temp
			}
			this.subs.push(d);
			window.target = null
			window.temp = null
		}

	}
	removeSub(sub) {
		if (this.subs.length) {
			const index = this.subs.indexOf(sub);
			this.subs.splice(index, 1);
		}
	}
	depend(name) {
		this.addSub(name);
	}
	notify(key, e) {
		console.log(this.subs, key, e)
		const subs = this.subs.slice();
		for (let i = 0; i < subs.length; i++) {
			//触发更新函数。{{}} v-if v-model 等
			subs[i].target.innerHTML = render(subs[i].temp, vueData)
		}
	}
}

//下面的步骤类似于vue的模板编译后的虚拟dom创建真实dom并绑定数据。
class VNnode {
	//构造函数
	//一个节点会有标签（tag）属性（props）value，标签类型
	constructor(tag, props, value, type) {
		//标签名转小写
		this.tag = tag && tag.toLowerCase()
		this.props = props
		this.value = value
		this.type = type
		this.children = []
	}
	//追加子元素
	appendChild(vnode) {
		this.children.push(vnode)
	}
}
//将html结构转为虚拟dom
function getVNode(node) {
	//获取节点类型
	let nodeType = node.nodeType
	//定义虚拟DOM
	let _vnode = null
	///nodeType 为一表示标签节点
	if (nodeType === 1) {
		let nodeName = node.nodeName
		//节点属性
		let attrs = node.attributes
		//获取props
		let _attrObj = {}
		//遍历所有节点
		for (let i = 0; i < attrs.length; i++) {
			_attrObj[attrs[i].nodeName] = attrs[i].nodeValue
		}
		//nodeName标签名 ,_attrObj 属性 第三位value  nodeType 标签类
		// <div></div>,标签节点,中间的value是文本节点,所有value是undefined
		//生成虚拟DOM
		_vnode = new VNnode(nodeName, _attrObj, undefined, nodeType)
		//node的子节点
		let childNodes = node.childNodes
		// 打印验证生成的子节点
		//console.log(childNodes)
		//子节点进行循环遍历生成虚拟DOM
		for (let i = 0; i < childNodes.length; i++) {
			_vnode.appendChild(getVNode(childNodes[i]))
		}
	}
	//文本节点
	//<div>哈哈哈</div> 中间的哈哈哈才能表示文本节点,所以标签名和属性时undefined
	else if (nodeType === 3) {
		_vnode = new VNnode(undefined, undefined, node.nodeValue, nodeType)
	}
	return _vnode
}

const reg = /\{\{(\w+)\}\}/;

function parseVNode(vnode) {
	//获取类型
	let type = vnode.type
	//定义真实DOM
	let _node = null
	//文本节点
	if (type === 3) {
		if (vnode.value) {


		}
		return document.createTextNode(vnode.value) //创建文本节点

	} else if (type === 1) {
		//元素节点
		_node = document.createElement(vnode.tag) // 创建元素标签名
		//1.属性
		let props = vnode.props //props此时为键值对 即还原 class = 'value'
		Object.keys(props).forEach((key) => {
			let attrName = key //属性名
			let attrValue = props[key] //属性值
			//绑定标签的属性值
			_node.setAttribute(attrName, attrValue)
		})
		//2.子节点
		let children = vnode.children
		//遍历子节点 ,子节点此时为虚拟DOM
		children.forEach((subvnode) => {
			if (reg.test(subvnode.value)) {
				window.target = _node
				window.temp = subvnode.value
				subvnode.value = render(subvnode.value, vueData)
			}
			_node.appendChild(parseVNode(subvnode)) //调用转换真实DOM函数,递归转换为子元素
		})
		return _node
	}
}
//解析vue模板{{}}语法
function render(template, data) {
	const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
	if (reg.test(template)) { // 判断模板里是否有模板字符串
		const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
		template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
		return render(template, data); // 递归的渲染并返回渲染后的结构
	}
	return template; // 如果模板没有模板字符串直接返回
}
let vueData = {}
function myVue(ele,data) {
	vueData = data
	new Observer(vueData);
	let root = ele
	//转换为虚拟DOM
	let vroot = getVNode(root)
	let Edom = parseVNode(vroot)
	document.body.removeChild(root) //移除原来的dom
	document.body.appendChild(Edom) //渲染编译后的dom
	console.log(Edom)
}

