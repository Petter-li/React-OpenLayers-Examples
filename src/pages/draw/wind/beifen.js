import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import * as Style from 'ol/style';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import * as Proj from 'ol/proj';
import OSM from 'ol/source/OSM';
import Windy from '@/utils/windy.js'
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class LayersWind extends React.Component {

    componentDidMount() {
        window.requestAnimationFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 20);
                };
        })();
        this.initControl();
    }

    initControl = () => {
        let vector = new VectorLayer({
            source: new VectorSource(),
            style: new Style.Style({
                image: new Style.Circle({
                    radius: 5,
                    fill: new Style.Fill({
                        color: "#FD4403"
                    })
                }),
                stroke: new Style.Stroke({
                    color: "#02BF9D",
                    width: 2
                })
            }),
            zIndex: 100
        });
        const map = new Map({
            target: 'mapDraw-wind',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vector
            ],
            view: new View({
                center: Proj.transform([108.25, 30.13550], 'EPSG:4326', 'EPSG:3857'),
                zoom: 2, //地图初始显示级别
                minZoom: 1,
                maxZoom: 11,
                zoomFactor: 1.96,
                //extent: Proj.transformExtent([99.1186523, 25.87899, 118.00415039, 34.279914], 'EPSG:4326', 'EPSG:3857')
            })
        });

        this.getData(map);
    }

    addWindMap = (map, windData) => {
        const _this = this;
        var canvas, windy;
        canvas = document.createElement('canvas');
        canvas.id = "windCanvas";
        canvas.width = map.getSize()[0];
        canvas.height = map.getSize()[1];
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        map.getViewport().appendChild(canvas);
        windy = new Windy({
            map: map,
            canvas: canvas,
            data: windData
        });
        var options = {
            size: .8,
            color: 'rgba(71,160,233,0.8)',
        };
        windy.change(options);
        _this.windDraw(map, canvas, windy, windData);
        map.getView().on('propertychange',function(){
            windy.stop();
            //$(canvas).hide();
            document.getElementById('windCanvas').style.visibility = 'hidden';
        });
        map.on("moveend",function(){
            _this.windDraw(map, canvas, windy, windData);
        });
    }

    windDraw = (map, canvas, windy, windData) => {
        //$(canvas).show();
        document.getElementById('windCanvas').style.visibility = 'visible';
        var bounds = map.getView().calculateExtent();
        var _min = [bounds[0], bounds[1]];
        var _max = [bounds[2], bounds[3]];
        var py = map.getPixelFromCoordinate([bounds[0], bounds[3]]); //经纬度转成屏幕坐标
        canvas.style.left = py.x + 'px';
        canvas.style.top = py.y + 'px';
        var points = this.invertLatLon(map, py, windData); //所有站点经纬度转为canvas坐标
        var min = map.getPixelFromCoordinate(_min);
        var max = map.getPixelFromCoordinate(_max);
        var extent = [
            [min[0] - py[0], max[1] - py[1]],
            [max[0] - py[0], min[1] - py[1]]
        ];
        windy.start(extent, points);
    }

    invertLatLon = (map, py, windData) => {
        var points = [];
        windData.forEach(function (station) {
            var px = map.getPixelFromCoordinate([station[1], station[0]]);
            points.push({
                x: px[0]-py[0],
                y: px[1]-py[1],
                angle: station[2],
                speed: station[3]
            });
        });
        return points;
    }

    getData = (map) => {
        const _this = this;
        fetch('../data/wind.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(windData) {
            var data = [];
            var p = 0;
            /* var maxMag = 0;
            var minMag = Infinity; */
            for (var j = 0; j < windData.ny; j++) {
                for (var i = 0; i <= windData.nx; i++) {
                    // Continuous data.
                    var p = (i % windData.nx) + j * windData.nx;
                    var vx = windData.data[p][0];
                    var vy = windData.data[p][1];
                    var mag = Math.sqrt(vx * vx + vy * vy);
                    // 数据是一个一维数组
                    // [ [经度, 维度，向量经度方向的值，向量维度方向的值] ]
                    data.push([
                        i / windData.nx * 360 - 180,
                        j / windData.ny * 180 - 90,
                        vx,
                        vy,
                        mag
                    ]);
                    /* maxMag = Math.max(mag, maxMag);
                    minMag = Math.min(mag, minMag); */
                }
            }
            _this.addWindMap(map, data);
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='风场粒子动画'>
            <Card bordered={false}>
              <div id="mapDraw-wind" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default LayersWind;