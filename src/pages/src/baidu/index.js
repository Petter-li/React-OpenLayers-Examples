import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import * as Proj from 'ol/proj';
import * as olExtent from 'ol/extent';
import projzh from 'projzh';
import XYZ from 'ol/source/XYZ';
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

/**
 * 两个难点
 * 1 百度地图在ol中会有地图偏移的问题，引入projzh解决
 * 2 百度个性化地图如何引入ol,通过更改网上已有的在线瓦片地图url地址中的参数来实现个性化,只能通过在线比对参数来更改参数
 */  


class BaiduMap extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        var extent = [99.1186523, 25.87899, 118.00415039, 34.279914];
        var baiduMercator = new Proj.Projection({
            code: 'baidu',
            extent: olExtent.applyTransform(extent, projzh.ll2bmerc),
            units: 'm'
          });

        Proj.addProjection(baiduMercator);
        Proj.addCoordinateTransforms('EPSG:4326', baiduMercator, projzh.ll2bmerc, projzh.bmerc2ll);
        Proj.addCoordinateTransforms('EPSG:3857', baiduMercator, projzh.smerc2bmerc, projzh.bmerc2smerc);

        var bmercResolutions = new Array(19);
        for (var i = 0; i < 19; ++i) {
            bmercResolutions[i] = Math.pow(2, 18 - i);
        }

        var baidu = new TileLayer({
            source: new XYZ({
                projection: 'baidu',
                maxZoom: 18,
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
                    // styles参数未转之前 在线转换地址 http://coolaf.com/zh/tool/ud 选择urlencode转换
                    // t:land|e:g|c:#081734,t:building|e:g|c:#04406F,t:building|e:l|v:off,t:highway|e:g|c:#015B99,t:highway|e:l|v:off,t:arterial|e:g|c:#003051,t:arterial|e:l|v:off,t:green|e:g|v:off,t:water|e:g|c:#044161,t:subway|e:g.s|c:#003051,t:subway|e:l|v:off,t:railway|e:g|v:true,t:railway|e:l|v:true,t:all|e:l.t.s|c:#313131,t:all|e:l.t.f|c:#FFFFFF,t:manmade|e:g|v:off,t:manmade|e:l|v:off,t:local|e:g|v:off,t:local|e:l|v:off,t:subway|e:g|l:-65,t:railway|e:all|l:-40,t:boundary|e:g|c:#8b8787|l:-29|w:1,t:poi|e:l|v:off|c:#022338|e:l|v:off,t:road|e:g|v:off,t:road|e:l|v:off,t:road|e:g.s|c:#ffffff00,t:district|e:l|v:off,t:poi
                     return "http://api2.map.bdimg.com/customimage/tile?&x=" + x + "&y=" + y + "&z=" + z + "&udt=20191119&scale=1&ak=E4805d16520de693a3fe707cdc962045&styles=t%3Aland%7Ce%3Ag%7Cc%3A%23081734%2Ct%3Abuilding%7Ce%3Ag%7Cc%3A%2304406F%2Ct%3Abuilding%7Ce%3Al%7Cv%3Aoff%2Ct%3Ahighway%7Ce%3Ag%7Cc%3A%23015B99%2Ct%3Ahighway%7Ce%3Al%7Cv%3Aoff%2Ct%3Aarterial%7Ce%3Ag%7Cc%3A%23003051%2Ct%3Aarterial%7Ce%3Al%7Cv%3Aoff%2Ct%3Agreen%7Ce%3Ag%7Cv%3Aoff%2Ct%3Awater%7Ce%3Ag%7Cc%3A%23044161%2Ct%3Asubway%7Ce%3Ag.s%7Cc%3A%23003051%2Ct%3Asubway%7Ce%3Al%7Cv%3Aoff%2Ct%3Arailway%7Ce%3Ag%7Cv%3Atrue%2Ct%3Arailway%7Ce%3Al%7Cv%3Atrue%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23313131%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%23FFFFFF%2Ct%3Amanmade%7Ce%3Ag%7Cv%3Aoff%2Ct%3Amanmade%7Ce%3Al%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Ag%7Cv%3Aoff%2Ct%3Alocal%7Ce%3Al%7Cv%3Aoff%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-65%2Ct%3Arailway%7Ce%3Aall%7Cl%3A-40%2Ct%3Aboundary%7Ce%3Ag%7Cc%3A%238b8787%7Cl%3A-29%7Cw%3A1%2Ct%3Apoi%7Ce%3Al%7Cv%3Aoff%7Cc%3A%23022338%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Ag.s%7Cc%3A%23ffffff00%2Ct%3Adistrict%7Ce%3Al%7Cv%3Aoff%2Ct%3Apoi";
                },
                tileGrid: new TileGrid({
                    resolutions: bmercResolutions,
                    origin: [0, 0],
                    extent: olExtent.applyTransform(extent, projzh.ll2bmerc),
                    tileSize: [256, 256]
                })
            })
        });

        var mapLayer = new Map({
            target: 'src-baidu',
            layers: [
                baidu
            ],
            view: new View({
                center: Proj.transform([108.25, 30.13550], 'EPSG:4326', 'EPSG:3857'),
                zoom: 8, //地图初始显示级别
                minZoom:6,
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
                    color: '#FFFFFF', //'#21A083'
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
          <PageHeaderWrapper title='百度个性化地图'>
            <Card bordered={false}>
              <div id="src-baidu" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default BaiduMap;