import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import * as Style from 'ol/style';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OSM from 'ol/source/OSM';
import OlWindy from 'wind-layer/dist/OlWindy.js'
import axios from 'axios'
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class LayersWind extends React.Component {

    componentDidMount() {
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
                    source: new OSM({
                        url: "http://{a-c}.sm.mapstack.stamen.com/" +
          "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
          "{z}/{x}/{y}.png"
                    })
                }),
                vector
            ],
            loadTilesWhileAnimating: true,
            view: new View({
                center: [113.53450137499999, 34.44104525],
                zoom: 5
                //extent: Proj.transformExtent([99.1186523, 25.87899, 118.00415039, 34.279914], 'EPSG:4326', 'EPSG:3857')
            })
        });

        //this.getData(map);
        this.getModuleData(map);
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
            //_this.addWindMap(map, data);
        });
    }

    getModuleData = (map) => {
        /* fetch('../data/gitWind.json')
        .then(function(response) {
            return response.json();
        }) */
        axios.get('../data/gitWind.json')
        .then(function(data) {
            if (data.data.length > 0) {
                var wind = new OlWindy(data.data, {
                  layerName: '',
                  minResolution: undefined,
                  maxResolution: undefined,
                  zIndex: 101,
                  ratio: 1,
                  map: map,
                  colorScale: [
                    "rgb(36,104, 180)",
                    "rgb(60,157, 194)",
                    "rgb(128,205,193 )",
                    "rgb(151,218,168 )",
                    "rgb(198,231,181)",
                    "rgb(238,247,217)",
                    "rgb(255,238,159)",
                    "rgb(252,217,125)",
                    "rgb(255,182,100)",
                    "rgb(252,150,75)",
                    "rgb(250,112,52)",
                    "rgb(245,64,32)",
                    "rgb(237,45,28)",
                    "rgb(220,24,32)",
                    "rgb(180,0,35)"
                  ],
                  minVelocity: 0,
                  maxVelocity: 10,
                  velocityScale: 0.05,
                  particleAge: 90,
                  lineWidth: 1,
                  particleMultiplier: 0.01,
                })
                //wind.appendTo(map);
                map.addLayer(wind)
            }
        })
    };

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