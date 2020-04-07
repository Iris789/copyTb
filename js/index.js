var oDivLeft = document.getElementsByClassName('pic1-box-left')[0];
var oDivPic = oDivLeft.getElementsByClassName('nav1')[0];
var oDivBtn = oDivLeft.getElementsByClassName('btn')[0];
var oDivPrev = oDivLeft.getElementsByClassName('prev')[0];
var oDivNext = oDivLeft.getElementsByClassName('next')[0];
var oDivSpot = oDivLeft.getElementsByClassName('spot')[0];
var oSpan = oDivSpot.getElementsByTagName('span'),
    num = oSpan.length, currIndex = 0;
var timer = null;
var key = false;//防止多次快速点击按钮出现上次还未完成下次便清除了定时器
var size = 520,
    fullSize = size * num;//每个图片宽 不同图片个数
defaultMove();
function defaultMove() {
    //默认从左往右移动
    //最后一张时移到第一张上
    timer = setInterval(autoMove, 1500);
}
function autoMove(direction) {
    if (key) return;
    key = true;
    if (!direction || direction == 'left->right') {
        currIndex = currIndex == num - 1 ? 0 : currIndex + 1;
        changeIndex(currIndex);
        if (oDivPic.offsetLeft == -fullSize) {
            oDivPic.style.left = '0px';
        }
        startMove(oDivPic, { left: oDivPic.offsetLeft - size }, function () {
            key = false;
        });
    } else {
        currIndex = currIndex == 0 ? num - 1 : currIndex - 1;
        changeIndex(currIndex);
        if (oDivPic.offsetLeft == 0) {
            oDivPic.style.left = -fullSize + 'px';
        }
        startMove(oDivPic, { left: oDivPic.offsetLeft + size }, function () {
            key = false;
        });
    }
}
function startMove(dom, json, callback) {
    clearInterval(dom.timer);
    var iSpeed, iCurr, count;
    dom.timer = setInterval(function () {
        count = 0;
        for (var attr in json) {
            if (attr == 'opacity') {
                iCurr = parseFloat(getStyle(dom, attr)) * 100;
            } else {
                iCurr = parseInt(getStyle(dom, attr));
            }
            iSpeed = (json[attr] - iCurr) / 7;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if (json[attr] == iCurr) {
                count++;
            } else {
                if (attr == 'opacity') {
                    dom.style.opacity = (iCurr + iSpeed) / 100;
                } else {
                    dom.style[attr] = iCurr + iSpeed + 'px';
                }
            }
        }
        //Object.keys(json)获取对象json的长度
        if (count == Object.keys(json).length) {
            clearInterval(dom.timer);
            typeof callback == 'function' ? callback() : '';
        }
    },30)
}
function getStyle(elem, prop) {
    if (elem.currentStyle) {
        return elem.currentStyle[prop];
    } else {
        return window.getComputedStyle(elem, null)[prop];
    }
}
function changeIndex(_index) {
    for (var i = 0; i < num; i++){
        oSpan[i].className = '';
    }
    oSpan[_index].className = 'active';
}

oDivLeft.onmouseenter = function () {
    oDivBtn.style.display = 'block';
    clearInterval(timer);
}
oDivLeft.onmouseleave = function () {
    oDivBtn.style.display = 'none';
    timer = setInterval(autoMove, 1500);
}

oDivPrev.onclick = function () {
    //移动到前一张图片
    //当前为第一张图片，移动到最后一张
    autoMove('right->left');
}
oDivNext.onclick = function () {
    //移动到后一张图片
    //当前为最后一张图片，移动到第一张
    autoMove('left->right');
}

oDivSpot.onclick = function (e) {
    var event = e || window.event;
    var target = event.srcElement || event.target;
    if (target.nodeName == 'SPAN') {
        //移动到对应第几张图片
        currIndex = parseInt(target.innerText) - 1;
        changeIndex(currIndex);
        startMove(oDivPic, { left: -size * currIndex });
    }
}