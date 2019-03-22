import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { defaults as controlDefaults } from 'ol/control'
import FullScreen from 'ol/control/FullScreen'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class FullScreenControl extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        new Map({
            target: 'mapControl-fullScreen',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [12900000, 4900000],
                zoom: 8
            }),
            controls: controlDefaults().extend([new FullScreen()])
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='全屏显示'>
            <Card bordered={false}>
              <div id="mapControl-fullScreen" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default FullScreenControl;