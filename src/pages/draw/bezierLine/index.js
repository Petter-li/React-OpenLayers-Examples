import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import GeoJson from 'ol/format/GeoJson';
import * as Style from 'ol/style';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import flyLine from '@/utils/flyLine.js'
import * as Proj from 'ol/proj';
import OSM from 'ol/source/OSM';
import GeoJsonData from '@/assets/data/geojson/ChongqingCounty.geojson'
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class LayersC extends React.Component {
    state = {
        lines:[
            [[106.5525, 29.5818], [107.7989, 29.8668]],
           /*  [[106.5525, 29.5818], [108.3968, 30.8163]],
            [[106.5525, 29.5818], [107.7805, 29.3201]],
            [[106.5525, 29.5818], [105.6005, 29.4087]], */
        ]
    }

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const { lines } = this.state;
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
            target: 'mapDraw-bezierLine',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vector
            ],
            view: new View({
                center: Proj.transform([108.25, 30.13550], 'EPSG:4326', 'EPSG:3857'),
                zoom: 8, //地图初始显示级别
                minZoom:7,
                maxZoom: 11,
                zoomFactor: 1.96,
                extent: Proj.transformExtent([99.1186523, 25.87899, 118.00415039, 34.279914], 'EPSG:4326', 'EPSG:3857')
            })
        });
        let cords = lines.map(item => this.centerPoint(item));
        let ani = new flyLine(cords, vector);
    }

    //为两个点求出一个中间点，来展示轨迹路线
    centerPoint = (line) => {
        var start = line[0];
        var end = line[1];
        var centerPoint = [(start[0] + end[0]) / 2 - 0.2, (start[1] + end[1]) / 2 + 0.2];
        line.splice(1, 0, centerPoint);
        return line;
    }

    render() {
        return (
          <PageHeaderWrapper title='图层控件'>
            <Card bordered={false}>
              <div id="mapDraw-bezierLine" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default LayersC;