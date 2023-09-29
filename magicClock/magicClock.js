/**
 * 欢迎！未来的潮人！
 * 请在这个文件中完成魔法时钟的制作
 * 您甚至不需要编辑其他文件，但我们鼓励更多的探索！
 * 现在您可以删掉这段注释，开始实践。
 */

var canvas = document.getElementById('ClockCanvas');
var ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 1000;

/**绘制表盘 */
var img1 = new Image();
img1.src = 'src/ClockBoard.png';
/**绘制时针 */
var img2 = new Image();
img2.src = 'src/HourHand.png';
/**绘制分针 */
var img3 = new Image();
img3.src = 'src/MinuteHand.png';
/**h绘制插销 */
var img4 = new Image();
img4.src = 'src/Bolt.png';

/**拖动插销 */
//获取位置信息
const getCanvasPosition = (e) => {
  return {
    x: e.offsetX,
    y: e.offsetY,
  };
};
//插销原位置
const Bolts = [];
Bolts.push({
  x: 212.5,
  y: 150,
  r: 150,
});
//鼠标状态
const stautsConfig = {
  blank: 0,
  drag_start: 1,
  dragging: 2,
};

const canvasInfo = {
  status: stautsConfig.IDLE,
  dragTarget: null,
  lastEvtPos: { x: null, y: null },
};
//距离计算
const getDistance = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

const ifin = (pos) => {
  const getDistance = (p1, p2) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };
  for (let i = 0; i < Bolts.length; i++) {
    if (getDistance(Bolts[i], pos) < Bolts[i].r) {
      return Bolts[i];
    }
  }
  return false;
};
//表盘位置
const clockboardInfo = {
  center: { x: 225, y: 577.5 },
};
//插销位置
const boltInfo = {
  center: { x: 212.5, y: 150 },
};

var hh, mm;
//不同鼠标状态下实现功能
canvas.addEventListener('mousedown', (e) => {
  const canvasPosition = getCanvasPosition(e);
  console.log(canvasPosition);
  const BoltsRef = ifin(canvasPosition);
  if (BoltsRef) {
    canvasInfo.dragTarget = BoltsRef;
    canvasInfo.status = stautsConfig.drag_start;
    canvasInfo.lastEvtPos = canvasPosition;
  }
  if (getDistance(canvasPosition, boltInfo.center) <= 150 && getDistance(canvasPosition, clockboardInfo.center) > 177.5) {
  } else if (getDistance(canvasPosition, clockboardInfo.center) <= 177.5) {
    console.log('True');
    if (boltInfo.center.y > 300) {
      //计算tan
      var k = (canvasPosition.y - clockboardInfo.center.y) / (canvasPosition.x - clockboardInfo.center.x);
      //计算弧度
      var radian = Math.atan(k);
      //计算角度
      var angle = (180 / Math.PI) * radian;
    }
    if (canvasPosition.x > clockboardInfo.center.x) {
      angle = 90 + angle;
    }
    if (canvasPosition.x < clockboardInfo.center.x) {
      angle = 270 + angle;
    }
    console.log(angle);
    //计算时间
    hh = parseInt(angle / 30);
    mm = parseInt(angle - hh * 30) * 2;
  }
});

var x = 212.5,
  y = 150;
var x1 = 50,
  y1 = 802.5;

canvas.addEventListener('mousemove', (e) => {
  const canvasPosition = getCanvasPosition(e);
  if (canvasInfo.status === stautsConfig.drag_start && getDistance(canvasPosition, canvasInfo.lastEvtPos) > 5) {
    canvasInfo.status = stautsConfig.dragging;
  } else if (canvasInfo.status === stautsConfig.dragging) {
    const { dragTarget } = canvasInfo;
    dragTarget.x = canvasPosition.x;
    dragTarget.y = canvasPosition.y;
    boltInfo.center.x = dragTarget.x;
    boltInfo.center.y = dragTarget.y;
    return dragTarget.x, dragTarget.y;
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (canvasInfo.status === stautsConfig.dragging) {
  }
  canvasInfo.status = stautsConfig.IDLE;
});

/**让钟动起来 */
setInterval(function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img4, 187.5, boltInfo.center.y - 100, 80, 200);
  ctx.drawImage(img1, 50, 400, 355, 355);
  var a = getTime();
  img2.src = 'src/HourHand.png';
  var h = a.slice(0, 2);
  var m = a.slice(3, 5);
  if (a > 12) h -= 12;
  //指针转动
  ctx.translate(230.5, 577.5);
  ctx.rotate((h * 30 * Math.PI) / 180 + ((m / 2) * Math.PI) / 180);
  ctx.drawImage(img2, -16.5, -139, 33, 159);
  ctx.rotate((-h * 30 * Math.PI) / 180 - ((m / 2) * Math.PI) / 180);
  ctx.translate(-230.5, -577.5);

  ctx.translate(230.5, 577.5);
  ctx.rotate((m * 6 * Math.PI) / 180);
  ctx.drawImage(img3, -6.5, -138, 13, 158);
  ctx.rotate((-m * 6 * Math.PI) / 180);
  ctx.translate(-230.5, -577.5);
  //停止转动
  if (boltInfo.center.y > 300) {
    freezeTime();
    //存储当前时间（24小时制）
    if (hh < h && hh + 12 < h) {
      hh = hh;
    }
    if (hh < h && hh + 12 > h) {
      hh += 12;
    }
    if (hh > h && hh + 12 > h) {
      hh = hh;
    }
    console.log(hh, mm);
    setTime(hh + ':' + mm);
  }
  //继续转动
  if (boltInfo.center.y < 300) {
    meltTime();
    //存储正在流动的时间（刷新hh和mm，否则将插销插回去会跳回上一次调的时间）
    hh = h;
    mm = m;
  }
}, 15);



