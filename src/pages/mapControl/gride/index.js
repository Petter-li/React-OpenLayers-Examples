import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileDebug from 'ol/source/TileDebug';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class Gride extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        let osmSource = new OSM();
        new Map({
            target: 'mapControl-gride',
            layers: [
                new TileLayer({
                    source: osmSource
                }),
                new TileLayer({
                    source: new TileDebug({
                        projection: 'EPSG:3857',//地图投影坐标系
                        tileGrid: osmSource.getTileGrid()//获取瓦片图层数据对象(osmSource)的网格信息
                    })
                })
            ],
            view: new View({
                center: [12000000, 4000000],
                zoom: 8
            })
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='网格信息'>
            <Card bordered={false}>
              <div id="mapControl-gride" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default Gride;