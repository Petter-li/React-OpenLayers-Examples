import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import OverviewMap from 'ol/control/OverviewMap'
import {defaults as defaultControls} from 'ol/control';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class OverviewMapControl extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const overviewMapC = new OverviewMap({
            layers: [// 鹰眼中加载同坐标系下不同数据源的图层
                new TileLayer({
                    source: new OSM({
                        'url': 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                    })
                })
            ],
            collapseLabel: '\u00BB', // 鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
            label: '\u00AB', // 鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
            collapsed: false // 初始为展开显示方式
        })
        new Map({
            target: 'mapControl-overviewMap',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [12000000, 4000000],
                zoom: 8
            }),
            controls: defaultControls().extend([overviewMapC])
        });
    }

    render() {
        return (
          <PageHeaderWrapper title='鹰眼'>
            <Card bordered={false}>
              <div id="mapControl-overviewMap" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default OverviewMapControl;