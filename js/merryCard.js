var init = function() {
	deviceWidth = document.documentElement.clientWidth;
	deviceHeight = document.documentElement.clientHeight;

	var canvasdocument = document.getElementById('canvas');

	canvasdocument.width = deviceWidth;
	canvasdocument.height = deviceHeight;

	canvasdocument.style.width = deviceWidth;
	canvasdocument.style.height = deviceHeight;

	stage = new createjs.Stage(canvasdocument);
	//touch enable
	createjs.Touch.enable(stage);

	//构建进场动画
	createProgressContainer();
	//定义图片引用管理器
	imageQuene = {};
	touchF = undefined;

	createjs.Ticker.addEventListener("tick", handlerTicker);
	createjs.Ticker.setFPS(5);
};

var preloadFn = function() {
	preload = new createjs.LoadQueue(true);
	preload.on("progress", handleFileProgress);
	preload.on("fileload", handleFileLoad);
	preload.on("complete", loadComplete);
	preload.loadManifest({
		src: "js/manifest.json",
		type: "manifest"
	});
};

var createProgressContainer = function() {
	progressContainer = {};
	progressContainer['container'] = new createjs.Container();
	progressContainer['progressText'] = new createjs.Text('', "20px Arial", "#1A1616");
	progressContainer.progressText.y = -25;
	progressContainer['animationContainer'] = new createjs.Container();
	progressContainer['progressShape'] = new createjs.Shape();

	var border = new createjs.Shape();
	var widthOfProgress = deviceWidth / 3;
	progressContainer['maxWidth'] = widthOfProgress;
	border.graphics.ss(2).s("#AAAAAA").dr(0, 0, widthOfProgress, 9);
	progressContainer.animationContainer.addChild(border);
	progressContainer.animationContainer.addChild(progressContainer.progressShape);
	progressContainer.animationContainer.x = (-1) * widthOfProgress / 2;

	progressContainer.container.addChild(progressContainer.animationContainer, progressContainer.progressText);

	progressContainer.container.x = deviceWidth / 2;
	progressContainer.container.y = deviceHeight / 2;

	var bgBorder = new createjs.Shape();
	bgBorder.graphics.f('#FFD4D4').drawRect(0, 0, deviceWidth, deviceHeight);
	stage.addChild(bgBorder, progressContainer.container);
};

var handleFileProgress = function(event) {
	var progressValue = preload.progress * 100;
	progressContainer.progressText.text = Math.round(progressValue) + "%";
	progressContainer.progressText.x = (-1) * progressContainer.progressText.getMeasuredWidth() / 2;
	progressContainer.progressShape.graphics.clear();
	var widthP = preload.progress * progressContainer.maxWidth;
	progressContainer.progressShape.graphics.lf(["rgba(214,64,132,0.5)", "rgba(204,17,102,1)"], [0, 1], 0, 0, progressContainer.maxWidth, 0).dr(0, 0, widthP, 9).ef();
	stage.update();
};

var loadComplete = function(event) {
	doMerryCard();
};

var handleFileLoad = function(event) {
	if (event.item.id.match('image')) {
		imageQuene[event.item.id] = event.result;
	}
};

var handlerTicker = function(event) {
	stage.update();
};

var dealWithStage = function() {
	//移除stage中的元素
	//回复stage的alpha值为1
	stage.removeAllChildren();
	stage.alpha = 1;
	//构建欢迎页面
	createWelcomePage();
};

var createWelcomePage = function() {
	//清除touch后的其他页面
	if (!touchF) {
		//清除子类，回复初始值
		stage.removeAllChildren();
		stage.alpha = 1;
	}
	///////////
	//定义背景容器 //
	var bgContainer = new createjs.Container();
	stage.addChild(bgContainer);
	//背景图片
	var bgbitmap = new createjs.Bitmap(imageQuene["image_bg"]);
	if (deviceWidth > deviceHeight) {
		bgbitmap.scaleX = deviceWidth / 680;
		bgbitmap.scaleY = ((deviceWidth * 453) / 680) / 453;
	} else {
		bgbitmap.scaleX = ((deviceHeight * 680) / 453) / 680;
		bgbitmap.scaleY = deviceHeight / 453;
	}
	bgContainer.addChild(bgbitmap);
	bgContainer.alpha = 0;
	createjs.Tween.get(bgContainer).to({
		alpha: 1
	}, 2000);
	///////////
	///////////
	//定义前景容器 //
	var fgContainer = new createjs.Container();
	fgContainer.alpha = 0;
	stage.addChild(fgContainer);
	//定义前景容器宽高以及位置
	var fgWidth = 200,
		fgHeight = deviceHeight * 0.5;
	fgContainer.setBounds(0, 0, fgWidth, fgHeight);
	fgContainer.x = deviceWidth / 2 - fgWidth / 2;
	fgContainer.y = 50;
	//在容器中添加前景照片
	var fgbitmap = new createjs.Bitmap(imageQuene['image_fg']);
	fgbitmap.cache(0, 0, 360, 640);
	fgbitmap.scaleX = 0.55;
	fgbitmap.scaleY = 0.55;
	fgContainer.addChild(fgbitmap);
	//定义前景mask
	var star = new createjs.Shape();
	star.graphics.de(0, 0, 200, fgHeight);
	fgbitmap.mask = star;
	//定义前景椭圆相框
	var starBorder = new createjs.Shape();
	starBorder.graphics.ss(5).s("#C70E0E").de(0, 0, 200, fgHeight);
	fgContainer.addChild(starBorder);
	//制定动画
	createjs.Tween.get(fgContainer).wait(2000).to({
		alpha: 1
	}, 2000);
	///////////
	///////////
	//定义姓名容器 //
	var fgWordContainer = new createjs.Container();
	fgWordContainer.setBounds(0, 0, 180, 50);
	fgWordContainer.x = deviceWidth / 2 - 90;
	fgWordContainer.y = fgHeight + 60;
	fgWordContainer.alpha = 0;
	stage.addChild(fgWordContainer);
	//定义姓名
	var name1 = new createjs.Text("钱乐毅", "23px Arial", "#FFFFFF");
	name1.x = 0;
	fgWordContainer.addChild(name1);

	var name2 = new createjs.Text("李静怡", "23px Arial", "#FFFFFF");
	var bt = name2.getBounds();
	name2.x = fgWordContainer.getBounds().width - bt.width;
	fgWordContainer.addChild(name2);
	//定义爱心
	var anchorPointX = fgWordContainer.getBounds().width / 2;
	var anchorPointY = 0;
	//绘制
	var loveGraphic = new createjs.Shape();
	loveGraphic.graphics.s("#FC168A").f("#F86969").moveTo(0, 5).bezierCurveTo(3, -2, 15, 7, 6, 15).bezierCurveTo(10, 10, 5, 15, 0, 20).bezierCurveTo(-5, 15, -10, 10, -6, 15).bezierCurveTo(-15, 7, -3, -2, 0, 5).closePath();
	loveGraphic.x = anchorPointX;
	loveGraphic.y = anchorPointY;
	fgWordContainer.addChild(loveGraphic);
	//制定动画
	createjs.Tween.get(fgWordContainer).wait(4000).to({
		alpha: 1
	}, 2000);
	///////////
	/////////////
	//定义时间地址容器 //
	var fgDateContainer = new createjs.Container();
	fgDateContainer.setBounds(0, 0, 200, 50);
	fgDateContainer.x = deviceWidth / 2 - 100;
	fgDateContainer.y = fgHeight + 60 + 50;
	fgDateContainer.alpha = 0;
	stage.addChild(fgDateContainer);
	//定义日期 与 地址
	var textAddress = new createjs.Text("沈阳 ● 天下春花园酒店", "18px Arial", "#FFFFFF");
	textAddress.x = 100 - textAddress.getBounds().width / 2;
	textAddress.y = 0;
	fgDateContainer.addChild(textAddress);

	var textDate = new createjs.Text("2015年 10月2日 12:00am", "13px Arial", "#FFFFFF");
	textDate.x = 100 - textDate.getBounds().width / 2;
	textDate.y = 20;
	fgDateContainer.addChild(textDate);

	//制定动画
	createjs.Tween.get(fgDateContainer).wait(5000).to({
		alpha: 1
	}, 1000);
	//根据cookie，针对第一次访问添加滑动方向提示掩膜

	//定义事件监听
	touchF = 0;
	var canvasDocument = $('#canvas');
	canvasDocument.on('swipeUp', handleSwipeUp);
	canvasDocument.on('swipeDown', handleSwipeDown);
	/////////////
};

var doMerryCard = function() {
	createjs.Tween.get(stage).to({
		alpha: 0
	}, 2000).call(dealWithStage);
};

/////////////
//定义事件处理方法 //
var handleSwipeLeft = function(evt) {
	if (progressContainer.photoFlag < 4) {
		progressContainer.photoFlag++;
		switchPhoto(progressContainer.photoFlag);
	}
};

var handleSwipeRight = function(evt) {
	if (progressContainer.photoFlag > 1) {
		progressContainer.photoFlag--;
		switchPhoto(progressContainer.photoFlag);
	}
};

var handleSwipeUp = function(evt) {
	if (touchF < 3) {
		touchF++;
		switchPage(touchF);
	}
};

var handleSwipeDown = function(evt) {
	if (touchF > 0) {
		touchF--;
		switchPage(touchF);
	}
};
/////////////

var switchPage = function(num) {
	switch (num) {
		case 0:
			{
				createjs.Tween.get(stage).to({
					alpha: 0
				}, 500).call(createWelcomePage);
				break;
			}
		case 1:
			{
				createjs.Tween.get(stage).to({
					alpha: 0
				}, 500).call(createPhotoPage);
				break;
			}
		case 2:
			{
				createjs.Tween.get(stage).to({
					alpha: 0
				}, 500).call(createLastPage);
				break;
			}
	}
};

var switchPhoto = function(num) {
	progressContainer.photoContainer.removeChild(progressContainer.imageUnit);
	progressContainer.photoContainer.removeChild(progressContainer.bgShapeOfPhoto);
	var imageString = "image_" + num;
	progressContainer.imageUnit = new createjs.Bitmap(imageQuene[imageString]);
	var imageBound = progressContainer.imageUnit.getBounds();
	switch (num) {
		case 1:
			{
				// createjs.Tween.get(progressContainer.photoContainer).to({
				// 	alpha: 0
				// }, 500).call(function(){

				// });
				progressContainer.photoContainer.setBounds(0,0,imageBound.width+6,imageBound.height+6);
				progressContainer.bgShapeOfPhoto.graphics.f("#FFFFFF").drawRect(0,0,imageBound.width+6,imageBound.height+6);
				progressContainer.photoContainer.addChild(progressContainer.bgShapeOfPhoto);
				progressContainer.photoContainer.x = deviceWidth / 2 - imageBound.width / 2;
				progressContainer.photoContainer.y = deviceHeight / 2 - imageBound.height / 2;
				progressContainer.photoContainer.addChild(progressContainer.imageUnit);
				progressContainer.imageUnit.x = 3;
				progressContainer.imageUnit.y = 3;
				break;
			}
		case 2:
			{
				// createjs.Tween.get(stage).to({
				// 	alpha: 0
				// }, 500).call(createPhotoPage);
				progressContainer.photoContainer.setBounds(0,0,imageBound.width+6,imageBound.height+6);
				progressContainer.bgShapeOfPhoto.graphics.f("#FFFFFF").drawRect(0,0,imageBound.width+6,imageBound.height+6);
				progressContainer.photoContainer.addChild(progressContainer.bgShapeOfPhoto);
				progressContainer.photoContainer.x = deviceWidth / 2 - imageBound.width / 2;
				progressContainer.photoContainer.y = deviceHeight / 2 - imageBound.height / 2;
				progressContainer.photoContainer.addChild(progressContainer.imageUnit);
				progressContainer.imageUnit.x = 3;
				progressContainer.imageUnit.y = 3;
				break;
			}
		case 3:
			{
				// createjs.Tween.get(stage).to({
				// 	alpha: 0
				// }, 500).call(createLastPage);
				break;
			}
		case 4:
		{
			// createjs.Tween.get(stage).to({
			// 	alpha: 0
			// }, 500).call(createLastPage);
			break;
		}
	}
};

var createPhotoPage = function() {
	//清除子类，回复初始值
	stage.removeAllChildren();
	stage.alpha = 1;
	/** 定义图片墙 */
	var photoBgContainer = new createjs.Container();
	stage.addChild(photoBgContainer);
	var bgShape = new createjs.Shape();
	/** 背景图片后续可以用图片涂鸦替代 */
	bgShape.graphics.f('#EF46B7').drawRect(0, 0, deviceWidth, deviceHeight);
	photoBgContainer.addChild(bgShape);
	/** 相框容器 */
	progressContainer['photoContainer'] = new createjs.Container();
	stage.addChild(progressContainer.photoContainer);
	progressContainer['bgShapeOfPhoto'] = new createjs.Shape();
	progressContainer['photoFlag'] = 0;
	progressContainer['imageUnit'] = new createjs.Bitmap(imageQuene['image_1']);
	var image1Bound = progressContainer.imageUnit.getBounds();
	progressContainer.photoContainer.setBounds(0, 0, image1Bound.width + 6, image1Bound.height + 6);
	progressContainer.photoContainer.x = deviceWidth / 2 - image1Bound.width / 2;
	progressContainer.photoContainer.y = deviceHeight / 2 - image1Bound.height / 2;
	progressContainer.bgShapeOfPhoto = new createjs.Shape();
	progressContainer.bgShapeOfPhoto.graphics.f("#FFFFFF").drawRect(0, 0, image1Bound.width + 6, image1Bound.height + 6);
	progressContainer.photoContainer.addChild(progressContainer.bgShapeOfPhoto, progressContainer.imageUnit);
	progressContainer.imageUnit.x = 3;
	progressContainer.imageUnit.y = 3;
	progressContainer.photoFlag++;
	//定义左右滑动事件
	var canvasDocument = $('#canvas');
	canvasDocument.on('swipeLeft', handleSwipeLeft);
	canvasDocument.on('swipeRight', handleSwipeRight);
};
var createLastPage = function() {
	//清除子类，回复初始值
	stage.removeAllChildren();
	stage.alpha = 1;
};