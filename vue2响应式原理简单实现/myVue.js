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
			console.log('getter', this);
			dep.depend(key);
			return val;
		},
		set: function(newVal) {
			// 修改 data[key] 时触发
			console.log('setter', newVal);
			if (val === newVal) {
				return;
			}
			val = newVal;
			dep.notify(newVal);
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
		console.log(window.target)
		for (let i = 0; i < this.subs.length; i++) {
			if (this.subs[i] == window.target) {
				this.subs.splice(i, 1);
			}
		}
		this.subs.push(window.target);
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
	notify(e) {
		console.log(this.subs)
		const subs = this.subs.slice();
		for (let i = 0; i < subs.length; i++) {
			//触发更新函数。{{}} v-if v-model 等
			console.log(subs[i] + "更新了")
			subs[i].innerHTML = e
		}
	}
}
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
new Observer(people);

let dom = document.createElement('div')
window.target = dom
dom.innerHTML = people.name;
document.body.appendChild(dom)
/**********************************************************************/
let input = document.createElement('input')
window.target = input
input.value = people.name;
input.type = "text"
input.addEventListener('input', e => {
	console.log(input.value)
	people.name = input.value
})
document.body.appendChild(input)
