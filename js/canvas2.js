(function ($) {
	$.fn.onLine = function (options) {
		var box = this;
		var linewidth = 2, linestyle = "#0C6";//连线绘制--线宽，线色
		const appMain = document.querySelector(".app-main")
		const imgList = document.querySelector(".img-list")
		const txtList = document.querySelector(".txt-list")
		//初始化赋值 列表内容
		const imgListItem = imgList.querySelectorAll('.list-item')
		const txtListItem = txtList.querySelectorAll('.list-item')
		Array.from(imgListItem).forEach(el => {
			const top = el.offsetTop + el.offsetHeight;
			const left = el.offsetLeft + el.offsetWidth / 2;
			el.setAttribute("group", "gpl");
			el.setAttribute("top", top);
			el.setAttribute("left", left);
			el.setAttribute("sel", 0);
			el.setAttribute("check", 0);
		})
		Array.from(txtListItem).forEach(el => {
			const top = el.offsetTop;
			const left = el.offsetLeft + el.offsetWidth / 2;
			el.setAttribute("group", "gpl");
			el.setAttribute("top", top);
			el.setAttribute("left", left);
			el.setAttribute("sel", 0);
			el.setAttribute("check", 0);
		})


		imgList.setAttribute('first', 0);//初始赋值 列表内容容器
		txtList.setAttribute('first', 0);
		//canvas 赋值
		var canvas = document.querySelector('.canvas');  //获取canvas  实际连线标签
		var backcanvas = document.querySelector('.backcanvas');  //获取canvas  实际连线标签
		canvas.width = appMain.offsetWidth;//canvas宽度等于div容器宽度
		canvas.height = appMain.offsetHeight;
		backcanvas.width = appMain.offsetWidth;//canvas宽度等于div容器宽度
		backcanvas.height = appMain.offsetHeight;
		//连线数据
		var groupstate = false;//按下事件状态，标记按下后的移动，抬起参考
		var mx = [];//连线坐标
		var my = [];
		var ms = [];
		var pairl = [];
		var pairr = [];
		var pair = 0;//配对属性
		var temp;//存贮按下的对象
		var mxid = [];
		var myid = [];
		var objL, objR;
		//提示线数据
		var mid_startx, mid_starty, mid_endx, mid_endy;//存储虚拟连线起始坐标
		//事件处理---按下
		var pairSet, countL, countR, orderCheck;
		var orderCheck = [];
		var orderPair = [];
		const listItem = document.querySelectorAll('.list-item');
		//addstyle list-item
		Array.from(listItem).forEach((el, i) => {
			el.onmousedown = function (event) {
				countL = 0;
				countR = 0;
				if (el.getAttribute('class').indexOf('addstyle') > -1) {
					orderCheck[i] = true;
					orderPair[i] = el.getAttribute("pair");
				} else {
					orderCheck[i] = false;
					orderPair[i] = null;
				}

				pairSet = parseInt(el.getAttribute("pair")) * 2;
				groupstate = true;
				if (el.getAttribute("check") == 1) {
					el.setAttribute("sel", "1")
					el.parentElement.setAttribute("first", "1")
					temp = el;
				} else {
					el.setAttribute("sel", "1")
					el.className += ' addstyle'
					el.parentElement.setAttribute("first", "1")
					temp = el;
				};
				mid_startx = el.getAttribute("left");
				mid_starty = el.getAttribute("top");
				event.preventDefault();
			}
		})
		document.onmousemove = function (event) {		//移动
			var $target = event.target;
			if (groupstate) {
				mid_endx = event.pageX - appMain.offsetLeft;
				mid_endy = event.pageY - appMain.offsetTop;
				var targettrue = null;
				if ($target && $target.nodeName === 'LI' && appMain.parentElement && appMain.parentElement.getAttribute("class") == box.attr("class")) {
					targettrue = $target;
				} else if ($target && $target.closest(".list-item") && $target.closest(".list-item").nodeName === 'LI' && appMain.parentElement && appMain.parentElement.getAttribute("class") == box.attr("class")) {
					targettrue = $target.closest(".list-item");
				} else {
					targettrue = null;
				};
				if (targettrue) {
					if (targettrue.parentElement.getAttribute("first") == 0) {
						if (targettrue.getAttribute("check") == 0) {
							targettrue.className += ' addstyle'
							targettrue.setAttribute("sel", "1")
							if (targettrue.closest(".list-item") && targettrue.closest(".list-item").getAttribute('check') && targettrue.closest(".list-item").getAttribute('check') === '0') {
								targettrue.closest(".list-item").className.replace('addstyle', '')
								targettrue.closest(".list-item").setAttribute('sel', '0')
							}
						};
					} else {
						if (targettrue.getAttribute("check") == 0) {
							targettrue.className += ' addstyle'
							targettrue.setAttribute("sel", "1")
							if (targettrue.closest(".list-item") && targettrue.closest(".list-item").getAttribute('check') && targettrue.closest(".list-item").getAttribute('check') === '0') {
								targettrue.closest(".list-item").className.replace('addstyle', '')
								targettrue.closest(".list-item").setAttribute('sel', '0')
							}
							mid_startx = targettrue.getAttribute("left");
							mid_starty = targettrue.getAttribute("top");
						};
					};
				} else {
					if (imgList.getAttribute("first") == 0) {
						Array.from(imgListItem).forEach(el => {
							if (el.getAttribute('check') == 0) {
								el.setAttribute("sel", "0")
								el.className.replace("addstyle", '');
							};
						})
					};
					if (txtList.getAttribute("first") == 0) {
						Array.from(txtListItem).forEach(el => {
							if (el.getAttribute('check') == 0) {
								el.setAttribute("sel", "0")
								el.className.replace("addstyle", '');
							};
						})
					};

				};
				backstrockline();
			};
			event.preventDefault();
		};
		document.mouseup = function (event) {  //抬起
			var $target = event.target
			if (groupstate) {
				var targettrue;
				if ($target && $target.nodeName === 'LI' && appMain.parentElement && appMain.parentElement.getAttribute("class") == box.attr("class")) {
					targettrue = $target;
				} else if ($target && $target.closest(".list-item") && $target.closest(".list-item").nodeName === 'LI' && appMain.parentElement && appMain.parentElement.getAttribute("class") == box.attr("class")) {
					targettrue = $target.closest(".list-item");
				} else {
					targettrue = null;
				};
				if (targettrue) {
					if (targettrue.parentElement.getAttribute("first") == 0) {
						if (targettrue.getAttribute("check") == 0) {
							if (temp.getAttribute('check') == 1) {
								Array.from(imgListItem).forEach(el => {
									if (el.getAttribute('sel') === 1) {
										objL = el;
										objL.setAttribute("check", "1");
										objL.setAttribute("sel", "0");
										countL++;
									}
								})
								Array.from(txtListItem).forEach(el => {
									if (el.getAttribute('sel') === 1) {
										objR = el;
										objR.setAttribute("check", "1");
										objR.setAttribute("sel", "0");
										countR++;
									}
								})

								if (countL == 1 && countR == 1) {
									mx.push(objL.getAttribute('left'));
									my.push(objL.getAttribute('top'));
									ms.push(0);
									objL.setAttribute("pair", pair);
									pairl.push(pair);
									mx.push(objR.getAttribute('left'));
									my.push(objR.getAttribute('top'));
									ms.push(1);
									objR.setAttribute("pair", pair);
									pairr.push(pair);
									pair += 1;
									imgList.setAttribute('first', 0);
									txtList.setAttribute('first', 0);
									var reLine = pairSet / 2;
									imgList.querySelector("li[pair='" + reLine + "']").className.replace('addstyle', '');
									imgList.querySelector("li[pair='" + reLine + "']").setAttribute("check", "0");
									imgList.querySelector("li[pair='" + reLine + "']").removeAttribute("pair");
									txtList.querySelector("li[pair='" + reLine + "']").className.replace('addstyle', '');
									txtList.querySelector("li[pair='" + reLine + "']").setAttribute("check", "0");
									txtList.querySelector("li[pair='" + reLine + "']").removeAttribute("pair");
									strockline2(pairSet);
								}
								else {
									listItem.setAttribute("sel", "0");
									Array.from(listItem).forEach((el, i) => {
										if (orderCheck[i] == true) {
											el.className += ' addstyle'
											el.setAttribute("check", "1")
											el.setAttribute("pair", orderPair[i])
										} else {
											el.className.replace('addstyle', '')
											el.setAttribute("check", "0")
											el.removeAttribute("pair")
										}
									})
									Array.from(document.querySelectorAll("li[sel='1']")).forEach(el => {
										el.className.replace('addstyle', '')
									})
								}

							} else {
								Array.from(imgListItem).forEach(el => {
									if (el.getAttribute('sel') === 1) {
										mx.push(el.getAttribute('left'));
										my.push(el.getAttribute('top'));
										ms.push(0);
										el.setAttribute("check", "1");
										el.setAttribute("sel", "0");
										el.setAttribute("pair", pair);
										pairl.push(pair);
										mxid.push(el.getAttribute('id'));
									}
								})
								Array.from(txtListItem).forEach(el => {
									if (el.getAttribute('sel') === 1) {
										mx.push(el.getAttribute('left'));
										my.push(el.getAttribute('top'));
										ms.push(1);
										el.setAttribute("check", "1");
										el.setAttribute("sel", "0");
										el.setAttribute("pair", pair);
										pairl.push(pair);
										mxid.push(el.getAttribute('id'));
									}
								})
								pair += 1;
								imgList.setAttribute('first', 0);
								txtList.setAttribute('first', 0);
								strockline();
							};
						} else {
							Array.from(imgListItem).forEach(el => {
								if (el.getAttribute('sel') == 1) {
									if (el.getAttribute('check') == 0) {
										el.setAttribute("sel", "0")
										el.className.replace("addstyle", '');
									} else {
										el.setAttribute("sel", "0")
										el.className += ' addstyle';
									};
								}
							})
							imgList.setAttribute('first', 0);
							Array.from(txtListItem).forEach(el => {
								if (el.getAttribute('sel') == 1) {
									if (el.getAttribute('check') == 0) {
										el.setAttribute("sel", "0")
										el.className.replace("addstyle", '');
									} else {
										el.setAttribute("sel", "0")
										el.className += ' addstyle';
									};
								}
							})
							txtList.setAttribute('first', 0);
						};
					} else {
						Array.from(imgListItem).forEach(el => {
							if (el.getAttribute('check') == 0) {
								if (el.getAttribute('sel') == 1) {
									el.setAttribute("sel", "0")
									el.className.replace("addstyle", '');
								}
							} else {
								if (el.getAttribute('sel') == 1) {
									el.setAttribute("sel", "0")
									el.className += ' addstyle';
								}
							}
						})
						imgList.setAttribute('first', 0);
						Array.from(txtListItem).forEach(el => {
							if (el.getAttribute('check') == 0) {
								if (el.getAttribute('sel') == 1) {
									el.setAttribute("sel", "0")
									el.className.replace("addstyle", '');
								}
							} else {
								if (el.getAttribute('sel') == 1) {
									el.setAttribute("sel", "0")
									el.className += ' addstyle';
								}
							}
						})
						txtList.setAttribute('first', 0);
					};
				} else {
					Array.from(imgListItem).forEach(el => {
						if (el.getAttribute('check') == 0) {
							if (el.getAttribute('sel') == 1) {
								el.setAttribute("sel", "0")
								el.className.replace("addstyle", '');
							}
						}
					})
					imgList.setAttribute('first', 0);
					Array.from(txtListItem).forEach(el => {
						if (el.getAttribute('check') == 0) {
							if (el.getAttribute('sel') == 1) {
								el.setAttribute("sel", "0")
								el.className.replace("addstyle", '');
							}
						}
					})
					txtList.setAttribute('first', 0);
				};
				clearbackline();
				groupstate = false;

			};
			event.preventDefault();
		}



		//canvas 追加2d画布			
		var context = canvas.getContext('2d');  //canvas追加2d画图
		var lastX, lastY;//存放遍历坐标
		function strockline() {//绘制方法

			context.clearRect(0, 0, appMain.offsetWidth, appMain.offsetHeight);//整个画布清除
			context.save();
			context.beginPath();
			context.lineWidth = linewidth;

			for (var i = 0; i < ms.length; i++) {  //遍历绘制 
				lastX = mx[i];
				lastY = my[i];
				if (ms[i] == 0) {
					context.moveTo(lastX, lastY);
				} else {
					context.lineTo(lastX, lastY);
				}
			}
			context.strokeStyle = linestyle;
			context.stroke();
			context.restore();
		};
		function strockline2(pairSet) {//绘制方法
			context.clearRect(0, 0, appMain.offsetWidth, appMain.offsetHeight);//整个画布清除
			context.save();
			context.beginPath();
			context.lineWidth = linewidth;
			var clearLine = pairSet;
			for (var i = 0; i < ms.length; i++) {  //遍历绘制 
				if (clearLine == i) {
					mx[i] = null;
					my[i] = null;
				}
				if ((clearLine + 1) == i) {
					mx[i] = null;
					my[i] = null;
				}
				lastX = mx[i];
				lastY = my[i];
				if (ms[i] == 0) {
					context.moveTo(lastX, lastY);
				} else {
					context.lineTo(lastX, lastY);
				}

			}
			context.strokeStyle = linestyle;
			context.stroke();
			// context.restore(); 
		};
		function clearline() {//清除
			context.clearRect(0, 0, appMain.offsetWidth, appMain.offsetHeight);
			mx = [];//数据清除
			my = [];
			ms = [];
			pairl = [];
			pairr = [];
			pair = 0;
			Array.from(imgListItem).forEach(el => {
				el.getAttribute('class').replace('addstyle', '')
				el.setAttribute('sel', '0')
				el.setAttribute('check', '0')
			})
			imgList.setAttribute('first', 0);
			Array.from(txtListItem).forEach(el => {
				el.getAttribute('class').replace('addstyle', '')
				el.setAttribute('sel', '0')
				el.setAttribute('check', '0')
			})
			txtList.setAttribute('first', 0);
		};
		//init backcanvas 2d画布 虚拟绘制
		var backcanvas = backcanvas.getContext('2d');
		function backstrockline() {//绘制
			backcanvas.clearRect(0, 0, appMain.offsetWidth, appMain.offsetHeight);
			backcanvas.save();
			backcanvas.beginPath();
			backcanvas.lineWidth = linewidth;
			backcanvas.moveTo(mid_startx, mid_starty);
			backcanvas.lineTo(mid_endx, mid_endy);
			backcanvas.strokeStyle = linestyle;
			backcanvas.stroke();
			backcanvas.restore();
		};
		function clearbackline() {//清除
			backcanvas.clearRect(0, 0, appMain.offsetWidth, appMain.offsetHeight);
			mid_startx = null; mid_starty = null; mid_endx = null; mid_endy = null;
		};
	}
})(jQuery);