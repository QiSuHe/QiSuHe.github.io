function isBackToTop() {
    var backToTopBtn = document.querySelector("#back-to-top")
    var currentHeight = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    if (currentHeight > 222) {
        backToTopBtn.style.display = "block"
    } else {
        backToTopBtn.style.display = "none"
    }
}

window.addEventListener("load", () => {
    isBackToTop()
    window.addEventListener("scroll", () => {
        isBackToTop()
    })

    var navItem = document.querySelectorAll("li.nav-item")
    var navToggler = document.querySelector("button.navbar-toggler")
    for (let i = 0; i < navItem.length; i++) {
        navItem[i].addEventListener("click", () => {
            navToggler.click()
        })
    }
})

const middleRotate = $(function ($, window) {

	var container = $('#carousel');//最外层容器
	var containerHeight = container.height();//最外层盒子的高度
	var contents = container.find('.content');//需要轮换的盒子
	var mid = Math.floor(contents.length / 2);//中间的那个盒子

	/* 修改rate值和distance值，再看看效果，你会明白很多 */
	var rate = 0.9;  //盒子进行大小变化,透明度变化的比率基数
	var distance = 60; //两个盒子层叠之后露出来的宽度

	var midWidth = 300;//这三个变量都是根据middleStyle的值来设置
	var midHeight = 400;

	var contentAll = document.querySelectorAll("#carousel .content")
	var contentNum = parseInt(contentAll.length / 2 + 1)
	var contentLeft = contentAll[contentNum].getBoundingClientRect().left
	var midLeft = (document.documentElement.clientWidth - midWidth) / 2 - contentLeft

	//中间盒子的样式
	var middleStyle = {
		width: `${midWidth}px`,
		height: `${midHeight}px`,
		lineHeight: `${midHeight}px`,
		top: '50px',
		left: `${midLeft}px`,
		opacity: 1,
		zIndex: 20,
		backgroundColor: 'indigo'
	};

	var timer = null;//设置一个自动轮换的定时器
	var intervalTime = 3000;//自动轮换的间隔时间

	//对盒子进行排序的函数
	function order() {
		contents = container.find('.content'); //顺序变化之后要重新获取
		/**
		 * 在函数开始就给中间位置的盒子设置样式
		 * 其他左右两边的盒子都是根据中间盒子的属性来计算自己的位置
		 */
		contents.eq(mid).css(middleStyle);
		//遍历contents设置每一个盒子的样式
		$.map(contents, function (value, index) {
			var n = Math.abs(mid - index),// n 值就相当于当前盒子在中间盒子旁边第几个
				r = Math.pow(rate, n).toFixed(2),// r 值为当前盒子相对于中间盒子的大小、透明度的比例
				posLeft = 0;//当前盒子应该在哪里

			if (index !== mid) {
				/* 
					注意：
					这里要先将当前value计算出来的宽度和高度储存下来，
					是因为需要防止 transition-duration的执行时间没有完成，
					使用$(value).width()/height()无法获取到正确的宽度和高度
				 */
				var valueHeight = r * midHeight,//当前盒子的宽高根据 r 值相对于中间盒子来计算
					valueWidth = r * midWidth;
				if (index < mid) { //在中间盒子的左边
					posLeft = midLeft - n * distance;
				} else if (index > mid) {//在中间盒子的右边
					posLeft = midLeft + midWidth + n * distance - valueWidth;
				}
				$(value).css({
					width: valueWidth + 'px',
					height: valueHeight + 'px',
					lineHeight: valueHeight + 'px',
					left: posLeft + 'px',
					top: (containerHeight - valueHeight) / 2 + 'px',//根据容器的高度进行垂直居中 top 值的计算
					zIndex: index > mid ? 20 - index : index,
					opacity: Math.pow(r, n).toFixed(2),//这里直接使用 r 也没有问题，只是直接使用 r ，透明度变化不明显，所以再进行一次幂运算
					backgroundColor: '#' + Math.floor(Math.random() * 100000 + 900000)//随机一个颜色，没什么作用，只是为了方便查看
				});
			}
		});
	}
	//添加事件函数
	function addEvent() {
		//移入外层容器，轮播图暂停，移出继续轮播
		container.hover(function () {
			clearInterval(timer);
		}, function () {
			autoPlay();
		});

		//点击左右两边的盒子，将其显示在中间
		contents.on('click', function () {
			var index = $(this).index();
			//如果点击的是中间的盒子就不用再重新排序了
			if (index === mid) {
				return;
			}
			/*
				点击时将被点击的盒子放到中间
				点击左边盒子时，后面的盒子往前排
				点击右边盒子时，前面的盒子往后排
			*/
			if (index < mid) {
				for (var i = 0; i < mid - index; i++) {
					container.prepend(contents.eq(contents.length - 1 - i));
				}
			} else if (index > mid) {
				for (var i = 0; i < index - mid; i++) {
					container.append(contents.eq(i));
				}
			}
			//每点击一次就要重新排序
			order();
		});
	}
	//自动轮换函数
	function autoPlay() {
		timer = setInterval(function () {
			contents.eq(mid + 1).click();
		}, intervalTime);
	}

	function init() {
		order();
		addEvent();
		autoPlay();
	}

	return init;
}(jQuery, window));

middleRotate()