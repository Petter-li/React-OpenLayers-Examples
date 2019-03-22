import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ZoomSlider from 'ol/control/ZoomSlider';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class Navigator extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const map = new Map({
            target: 'mapControl-navigator',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [12000000, 4000000],
                zoom: 4
            })
        });
        const zoomslider = new ZoomSlider();
        map.addControl(zoomslider);
       const zoomToExtent = new ZoomToExtent({
            extent: [13100000, 4290000,13200000,5210000]
        });
        map.addControl(zoomToExtent);
    }

    render() {
        return (
          <PageHeaderWrapper title='导航控件'>
            <Card bordered={false}>
              <div id="mapControl-navigator" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default Navigator;