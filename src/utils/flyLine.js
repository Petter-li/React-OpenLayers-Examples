import Feature from 'ol/Feature';
import * as geom from 'ol/geom';
import * as Style from 'ol/style';
import * as Proj from 'ol/proj';


function flyLine(lines, vector) {
    //1.根据给定的线段数据生成，线要素
    var fs = lines.map(function (val, index) {
        var line = new Feature({
            geometry: new geom.LineString(val)
        });
        return line;
    });

    var fLines = [];//存放贝塞尔曲线的线要素图层
    var m = 1;  //动画计数器
    this.cancelAnimation = null;
    var that = this;

    //得出路线的终点要素
    var endpoints = fs.map(function (val, index) {
        val.getGeometry().transform("EPSG:4326", "EPSG:3857");
        var endpoint = val.getGeometry().getCoordinates();
        var coor = [];//根据贝塞尔曲线的方法，求出这个线段上组成贝塞尔曲线上所有点
        for (var t = 0.01; t < 1; t += 0.01) {
            var p = that.bezierLine(endpoint, t);
            coor.push(p);
        }
        //由贝塞尔曲线组成的线段要素
        var line = new Feature({
            geometry: new geom.LineString(coor)
        });
        line.set('name', '编号为' + index);
        fLines.push(line);
        var point = new Feature({
            geometry: new geom.MultiPoint([endpoint[0], endpoint[endpoint.length - 1]])
        });
        return point;
    });


    //使用线要素展示动态移动的拖着尾巴的线
    var moveLine = fLines.map(function (val, index) {
        var line = new Feature({
            geometry: new geom.LineString(val.getGeometry().getCoordinates().slice(0, 3))
        });
        var moveStyle = new Style.Style({
            renderer: function (pixel, state) {
                var context = state.context;
                context.save();
                context.beginPath();
                //context.strokeStyle = 'rgba(255,0,0,1)';
                context.fillStyle = '#00FFFF';
                // context.shadowBlur = 13;
                // context.shadowColor = '#ff0000';
                context.lineWidth = 2;
                //第一步、先求出两个点的差值dx,dy，求出斜率
                //第二步、根据斜率求出弧度
                //第三步、确定这个斜率在第几象限，然后求出顺时针的弧度值
                //第四步、绘制半圆和尾巴
                var dx = pixel[0][0] - pixel[1][0];
                var dy = pixel[0][1] - pixel[1][1];
                var distance = Math.sqrt(dx * dx + dy * dy);
                var gradient = context.createRadialGradient(pixel[1][0], pixel[1][1], 2, pixel[1][0], pixel[1][1], distance + 6);
                gradient.addColorStop(0, '#00FFFF');
                gradient.addColorStop(1, '#00FFFF');
                context.fillStyle = gradient;
                var angle = null;
                //判断在那个象限
                if (dx > 0 && dy > 0) { //第一象限
                    angle = Math.PI * 2 - Math.atan(dy / dx);
                } else if (dx < 0 && dy > 0) { //第二象限
                    angle = Math.PI + Math.atan(dy / dx);
                } else if (dx < 0 && dy < 0) { //第三象限
                    angle = Math.PI + Math.atan(dy / dx);
                } else if (dx >= 0 && dy <= 0) {//第四象限
                    angle = Math.atan(dy / dx);
                }

                var startAngle = angle + Math.PI / 2;
                var endAngle = angle + Math.PI * 1.5;
                // if(startAngle<0){
                //     startAngle
                // }
                context.shadowBlur = 25;
                context.shadowColor = '#ffffff';


                context.arc(pixel[1][0], pixel[1][1], 5, startAngle, endAngle, false);//顺时针绘制图形pixel[0][0], pixel[0][1]
                context.lineTo(pixel[0][0], pixel[0][1]);

                context.closePath();
                //context.stroke();
                context.fill();
                context.restore();
            }
        });

        line.setStyle(moveStyle);
        return line;
    });
    vector.getSource().addFeatures(fLines);//添加贝塞尔曲线线要素
    vector.getSource().addFeatures(endpoints);//添加飞行终点路线
    vector.getSource().addFeatures(moveLine);  //添加飞行的动态点


    function drawPoint() {
        for (var i = 0, z = moveLine.length; i < z; i++) {

            var coordinates = fLines[i].getGeometry().getCoordinates();
            if (m > 0 && m < 92) {
                moveLine[i].getGeometry().setCoordinates(coordinates.slice(m, m + 8));
            }
        }
        m++;
        if (m >= 99) {
            m = 0;
        }
        that.cancelAnimation = requestAnimationFrame(drawPoint);
    }
    that.cancelAnimation = requestAnimationFrame(drawPoint);
}

flyLine.prototype.calculatePoint = function (points, fraction) {
    if (fraction > 1 || fraction < 0) {
        console.error("速率值不能大于1或小于0！");
        return;
    }
    var Lengths = [0];
    var x1 = points[0];
    var y1 = points[1];
    var length = 0;
    for (var i = 2, z = points.length; i < z; i += 2) {
        var x2 = points[i];
        var y2 = points[i + 1];
        length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        Lengths.push(length);
        x1 = x2;
        y1 = y2;
    }
    var targetLength = fraction * length;
    var targetIndex = 0;
    for (var m = 1, n = Lengths.length; m < n; m++) {
        if (targetLength < Lengths[m]) {
            targetIndex = m;
            break;
        }
    }
    //计算当前点所在区间，并计算出他的距离所占区间的百分比
    var occupyLength = (targetLength - Lengths[targetIndex - 1]) / (Lengths[targetIndex] - Lengths[targetIndex - 1]);

    var c = targetIndex * 2;
    function getTarget(a, b, occupyLength) {
        return a + (b - a) * occupyLength;
    }
    var pointX = getTarget(points[c - 2], points[c], occupyLength);
    var pointY = getTarget(points[c - 1], points[c + 1], occupyLength);
    return [pointX, pointY];
}

/**贝塞尔曲线求值思路
         *已知值三个点组成一个折线。A(X,Y),B(X,Y),C(X,Y)
         *一、设定占比系数t=0.01;每次增量为0.01；
         *二、求D点坐标，根据系数求出D点坐标
         *三、根据参数t，求出E点坐标
         *四、求出F点，并返回坐标点
        **/
flyLine.prototype.bezierLine = function (line, t) {
    var points = [].concat.apply([], line);
    var AB = points.slice(0, 4);
    var D = this.calculatePoint(AB, t);
    var BC = points.slice(2);
    var E = this.calculatePoint(BC, t);
    var DE = D.concat(E);
    var F = this.calculatePoint(DE, t);
    return F;
}


//结束动画
flyLine.prototype.cancelAni = function (vector) {
    vector.getSource().clear();
    cancelAnimationFrame(this.cancelAnimation)
}
export default flyLine;








