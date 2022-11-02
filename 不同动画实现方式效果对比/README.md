# 不同实现动画方式效果对比 

使用css3的和setInterval还有requestAnimationFrame三种方式实现选择动效进行对比动画效果  
animation：关键帧动画，类似requestAnimationFrame机制。通过 @keyframes 来定义关键帧， 浏览器会根据计时函数插值计算其余帧。 最流畅  
requestAnimationFrame ：定义浏览器在下一帧优先执行的dom操作。时间间隔紧紧跟随浏览器的刷新频率。动画效果和css差不多  
setInterval：通过计时器来执行动画，但是由于js单线程机制，在执行其他操作时可能导致动画丢帧，表现的没有钱两者流畅

### css3实现
```
		.css-dom{
			animation: roto 3s linear infinite;
		}
		@keyframes roto {
			from{
				transform: rotate(0deg);
			}
			to{
				transform: rotate(360deg);
			}
		}
```
### requestAnimationFrame实现
```
	let reqDom = document.querySelectorAll(".requestAnimationFrame-dom")
	for (let i = 0; i < reqDom.length; i++) {
		reqanim(reqDom[i])
	}
	
	function reqanim (dom){
		let move=0;
		let timer = requestAnimationFrame(function fn() {
			move = move+2.4
			if (move) {
				dom.style.transform = `rotate(${move}deg)`
				requestAnimationFrame(fn);
			} else {
				cancelAnimationFrame(timer);
			}
		});
	}
```



### setInterval实现
```
	let setDom = document.querySelectorAll(".setInterval-dom")
	for (let i = 0; i < setDom.length; i++) {
		let j = 0
		setInterval(()=>{
			j = j+2.4
			setDom[i].style.transform = `rotate(${j}deg)`
		},20)
	}
```
### 完整代码
```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<style>
		img {
			width: 10vw;
			height: 10vw;
		}
		body{
			font-weight: 600;
		}
		.box {
			width: 90vw;
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 20px;
			padding-top: 4vh;
			padding-bottom: 4vh;
		}
		.requestAnimationFrame-dom{
		}
		.setInterval-dom{
		}
		.css-dom{
			animation: roto 3s linear infinite;
		}
		@keyframes roto {
			from{
				transform: rotate(0deg);
			}
			to{
				transform: rotate(360deg);
			}
		}
	</style>
	<body>
		<div class="css">
			<div>css3实现动画</div>
			<div class="box">
				<img class="css-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="css-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="css-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="css-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="css-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
			</div>
		</div>
		<div class="setInterval">
			<div>setInterval实现动画</div>
			<div class="box">
				<img class="setInterval-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="setInterval-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="setInterval-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="setInterval-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="setInterval-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
			</div>

		</div>
		<div class="requestAnimationFrame">
			<div>requestAnimationFrame实现动画</div>
			<div class="box">
				<img class="requestAnimationFrame-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="requestAnimationFrame-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="requestAnimationFrame-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="requestAnimationFrame-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
				<img class="requestAnimationFrame-dom"
					 src="../img/1666078132695_CE4CFCCB-0747-4b88-BCF2-C0DF93A5AB25.png">
			</div>
		</div>
	</body>
<script>
	let setDom = document.querySelectorAll(".setInterval-dom")
	for (let i = 0; i < setDom.length; i++) {
		let j = 0
		setInterval(()=>{
			j = j+2.4
			setDom[i].style.transform = `rotate(${j}deg)`
		},20)
	}
	
	
	
	let reqDom = document.querySelectorAll(".requestAnimationFrame-dom")
	for (let i = 0; i < reqDom.length; i++) {
		reqanim(reqDom[i])
	}
	
	function reqanim (dom){
		let move=0;
		let timer = requestAnimationFrame(function fn() {
			move = move+2.4
			if (move) {
				dom.style.transform = `rotate(${move}deg)`
				requestAnimationFrame(fn);
			} else {
				cancelAnimationFrame(timer);
			}
		});
	}
	
</script>
</html>
```