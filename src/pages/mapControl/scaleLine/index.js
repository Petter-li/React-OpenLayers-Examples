import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ScaleLine from 'ol/control/ScaleLine';
import {defaults as defaultControls} from 'ol/control';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class ScaleLineControl extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const scaleLineControl = new ScaleLine({
            units: 'metric'// 设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
            // degress 温度  imperial 英里(mile)  nautical 海里  metric 公里  us 通用
        })
        new Map({
            target: 'mapControl-scaleLine',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            }),
            controls: defaultControls({attribution: false}).extend([scaleLineControl])// 隐藏右下角地图源信息，并加载比例尺控件
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='比例尺'>
            <Card bordered={false}>
              <div id="mapControl-scaleLine" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default ScaleLineControl;