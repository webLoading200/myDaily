# 我的日常练习


## 原生js实现图片压缩功能
此demo主要实现选择图片，压缩后下载的功能。主要使用html5的canvas标签的toDataURL和drawImage方法。首先选择图片，创建img标签。
并将其固定定位在屏幕外，创建canvas标签，大小和定位在图片上。获取到图片实例。调用canvas的drawImage()将其绘制在canvas上。
再调用canvas的toDataURL('image/jpeg', 压缩比例)生成压缩后的图片的base64编码。后调用base64转文件的方法生成文件，动态创建a标签下载
![](http://localhost:8888/uploads/imgs/压缩.png)

#### 主要代码
```javascriptlet imga = document.createElement('img');
	imga.src = fr.result;
	imga.style.position = 'fixed';
	imga.style.top = '-4000px';
	document.body.appendChild(imga);
	imga.onload = () => {
		let canvas = document.createElement('canvas');
		canvas.style.position = 'fixed';
		canvas.style.top = '-4000px';
		canvas.width = imga.width;
		canvas.height = imga.height;
		document.body.appendChild(canvas);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(imga, 0, 0, canvas.width, canvas.height);
		var base64Img = canvas.toDataURL('image/jpeg', 0.2);
		document.body.removeChild(canvas);
		document.body.removeChild(imga);
		img2.src = base64Img;
		let f = base64toFile(base64Img, "testimg")
		console.log(f)
		document.getElementById("end").innerHTML = "压缩后" + getSize1(f.size)
	}
	```
