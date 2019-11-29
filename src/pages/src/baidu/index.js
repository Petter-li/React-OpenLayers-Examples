import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import * as Proj from 'ol/proj';
import { defaults as controlDefaults } from 'ol/control'
import FullScreen from 'ol/control/FullScreen'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Source from 'ol/source';
import GeoJson from 'ol/format/GeoJson';
import GeoJsonData from '@/assets/data/geojson/ChongqingCounty.geojson'
import * as Style from 'ol/style';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class BaiduMap extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        var projection = Proj.get("EPSG:3857");
        var resolutions = [];
        for (var i = 0; i < 19; i++) {
            resolutions[i] = Math.pow(2, 18 - i);
        }
        var tilegrid = new TileGrid({
            origin: [0, 0],
            resolutions: resolutions
        });

        var baidu_black_source = new Source.TileImage({
            title: "百度街道暗黑地图",
            projection: projection,
            tileGrid: tilegrid,
            tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                if (!tileCoord) {
                    return "";
                }
                var z = tileCoord[0];
                var x = tileCoord[1];
                var y = tileCoord[2];

                if (x < 0) {
                    x = "M" + (-x);
                }
                if (y < 0) {
                    y = "M" + (-y);
                }

                return "http://api2.map.bdimg.com/customimage/tile?&x=" + x + "&y=" + y + "&z=" + z + "&udt=20180102&scale=1&ak=ZUONbpqGBsYGXNIYHicvbAbM&styles=t%3Aland%7Ce%3Ag%7Cc%3A%23081734%2Ct%3Abuilding%7Ce%3Ag%7Cc%3A%2304406F%2Ct%3Abuilding%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cc%3A%23015B99%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cc%3A%23003051%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Ag%7Cv%3Aoff%2Ct%3Awater%7Ce%3Ag%7Cc%3A%23044161%2Ct%3Asubway%7Ce%3Ag.s%7Cc%3A%23003051%2Ct%3Asubway%7Ce%3Al%7Cv%3Aoff%2Ct%3Arailway%7Ce%3Ag%7Cv%3Atrue%2Ct%3Arailway%7Ce%3Al%7Cv%3Atrue%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23313131%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%23FFFFFF%2Ct%3Amanmade%7Ce%3Ag%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Al%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Ag%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Al%7Cv%3Aoff%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-65%2Ct%3Arailway%7Ce%3Aall%7Cl%3A-40%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%238b8787%7Cl%3A-29%7Cw%3A1%2Ct%3Apoi%7Ce%3Al%7Cv%3Aoff%7Cc%3A%23022338";
            }
        });

        var layer = new TileLayer({
            source: baidu_black_source
        });

        var mapLayer = new Map({
            target: 'src-baidu',
            layers: [
                layer
            ],
            view: new View({
                center: Proj.transform([108.25, 30.13550], 'EPSG:4326', 'EPSG:3857'),
                zoom: 8, //地图初始显示级别
                minZoom:8,
                maxZoom: 11,
                zoomFactor: 1.96,
                extent: Proj.transformExtent([99.1186523, 25.87899, 118.00415039, 34.279914], 'EPSG:4326', 'EPSG:3857')
            }),
            controls: controlDefaults().extend([new FullScreen()])
        });
        this.addCQmap(mapLayer);
    }

    addCQmap = (map) => {
        let cqShowLayer= new VectorLayer({
            source: new Source.Vector({
                url: GeoJsonData,
                format: new GeoJson(),
            }),
            style: (feature) => new Style.Style({
                stroke: new Style.Stroke({ 
                    color: '#21A083',
                    width: 1,
                }),
               /*  fill: new Style.Fill({
                    color: 'rgba(255,255,255,1)'
                }), */
                text: new Style.Text({
                    textAlign: 'center',
                    font: 'normal 12px 微软雅黑',
                    text: feature.getProperties().Name,
                    fill: new Style.Fill({
                        color: '#fff'
                    }),
                    overflow: true,
                    scale: 0.9
                })
            }),
            type: 'anotherOriginMap',
            zIndex:30,
            name: '重庆区县界图'
        });
        map.addLayer(cqShowLayer);
    }

    render() {
        return (
          <PageHeaderWrapper title='百度地图'>
            <Card bordered={false}>
              <div id="src-baidu" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default BaiduMap;