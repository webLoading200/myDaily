//函数柯里化：将一次调用传入多个参数的函数，转换成多次调用，每次传入一个参数的函数
export const curry = (fn) => {
	let judge = (...args) => {
		if (args.length == fn.length) return fn(...args)
		return (...arg) => judge(...args, ...arg)
	}
	return judge
}

//数据类型判断
export const typeOf = (obj) => {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

//数组去重
export const unique = arr => [...new Set(arr)]

//数组扁平化
export const flatten = (arr) => {
	// let result = [];
	// for (let i = 0, len = arr.length; i < len; i++) {
	//     if (Array.isArray(arr[i])) {
	//         result = result.concat(flatten(arr[i]))
	//     } else {
	//         result.push(arr[i])
	//     }
	// }
	// return result;
	while (arr.some(item => Array.isArray(item))) {
		arr = [].concat(...arr);
	}
	return arr;
}

//深拷贝
export const deepClone = (obj) => {
	if (typeof obj !== 'object') return;
	let newObj = obj instanceof Array ? [] : {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
		}
	}
	return newObj;
}



//解析url为参数
export const parseParam = (url) => {
	const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
	const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
	let paramsObj = {};
	// 将 params 存到对象中
	paramsArr.forEach(param => {
		if (/=/.test(param)) { // 处理有 value 的参数
			let [key, val] = param.split('='); // 分割 key 和 value
			val = decodeURIComponent(val); // 解码
			val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

			if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
				paramsObj[key] = [].concat(paramsObj[key], val);
			} else { // 如果对象没有这个 key，创建 key 并设置值
				paramsObj[key] = val;
			}
		} else { // 处理没有 value 的参数
			paramsObj[param] = true;
		}
	})

	return paramsObj;
}

//图片懒加载 
export const imgLazyLoad = (function() {
	let count = 0
	let imgList = [...document.querySelectorAll('img')]
	let length = imgList.length
	return function() {
		let deleteIndexList = []
		imgList.forEach((img, index) => {
			let rect = img.getBoundingClientRect()
			if (rect.top < window.innerHeight) {
				img.src = img.dataset.src
				deleteIndexList.push(index)
				count++
				if (count === length) {
					document.removeEventListener('scroll', imgLazyLoad)
				}
			}
		})
		imgList = imgList.filter((img, index) => !deleteIndexList.includes(index))
	}
})()

//函数防抖简单版 触发高频事件 N 秒后只会执行一次，如果 N 秒内事件再次触发，则会重新计时。

export const debounce = function(func, wait=200) {
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		clearTimeout(timeout)
		timeout = setTimeout(function() {
			func.apply(context, args)
		}, wait);
	}
}


//函数防抖复杂版 触发高频事件 N 秒后只会执行一次，如果 N 秒内事件再次触发，则会重新计时。

export const debounceMain = function(func, wait=200, immediate) {
	let timeout, result;
	let debounced = function() {
		let context = this;
		let args = arguments;

		if (timeout) clearTimeout(timeout);
		if (immediate) {
			// 如果已经执行过，不再执行
			let callNow = !timeout;
			timeout = setTimeout(function() {
				timeout = null;
			}, wait)
			if (callNow) result = func.apply(context, args)
		} else {
			timeout = setTimeout(function() {
				func.apply(context, args)
			}, wait);
		}
		return result;
	};

	debounced.cancel = function() {
		clearTimeout(timeout);
		timeout = null;
	};

	return debounced;
}

//函数节流简单版 触发高频事件，且 N 秒内只执行一次。
export const throttle = function(func, wait=200) {
	let context, args;
	let previous = 0;

	return function() {
		let now = +new Date();
		context = this;
		args = arguments;
		if (now - previous > wait) {
			func.apply(context, args);
			previous = now;
		}
	}
}
//函数节流复杂版 触发高频事件，且 N 秒内只执行一次。
export const throttleMain = function(func, wait=200, options) {
	let timeout, context, args, result;
	let previous = 0;
	if (!options) options = {};

	let later = function() {
		previous = options.leading === false ? 0 : new Date().getTime();
		timeout = null;
		func.apply(context, args);
		if (!timeout) context = args = null;
	};

	let throttled = function() {
		let now = new Date().getTime();
		if (!previous && options.leading === false) previous = now;
		let remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
	};

	throttled.cancel = function() {
		clearTimeout(timeout);
		previous = 0;
		timeout = null;
	}
	return throttled;
}
