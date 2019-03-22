import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import MousePosition from 'ol/control/MousePosition'
import { createStringXY } from 'ol/coordinate'
import {defaults as defaultControls} from 'ol/control';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class MousePositionControl extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),// 坐标格式
            projection: 'EPSG:4326',// 地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
            className: 'custom-mouse-position', // 坐标信息显示样式，默认是'ol-mouse-position'
            target: document.getElementById('mouse-position'), // 显示鼠标位置信息的目标容器
            undefinedHTML: '&nbsp;'// 未定义坐标的标记
        });
        new Map({
            target: 'mapControl-mouse',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            }),
            controls: defaultControls({attribution: false}).extend([mousePositionControl])// 隐藏右下角地图源信息，并加载鼠标位置控件
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='鼠标位置'>
            <Card bordered={false}>
              <div id="mapControl-mouse" className={styles.mapWrapper} />
              <div id="mouse-position" className={styles.mouseWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default MousePositionControl;