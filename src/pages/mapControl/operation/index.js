import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
    Button
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class Operation extends React.Component {

    state = {
        mapObject: null,
        mapZoom: null,
        mapCenter: null,
        mapRotation: null
    }

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const map = new Map({
            target: 'mapControl-operation',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [12950000, 4860000],
                zoom: 8,
                minZoom: 6,
                maxZoom: 12,
                rotation: Math.PI / 6
            })
        });
        const mapView = map.getView();
        this.setState({
            mapObject: map,
            mapZoom: mapView.getZoom(),
            mapCenter: mapView.getCenter(),
            mapRotation: mapView.getRotation()
        })
    }

    zoomOut = () => {
        const { mapObject } = this.state;
        const view  = mapObject.getView();
            const zoom = view.getZoom();
        view.setZoom(zoom - 1);
    }

    zoomIn = () => {
        const { mapObject } = this.state;
        const view  = mapObject.getView();
            const zoom = view.getZoom();
        view.setZoom(zoom + 1);
    }

    zoomWuHan = () => {
        const { mapObject } = this.state;
        const view  = mapObject.getView();
            const whCoordinate = fromLonLat([114.31667, 30.51667]);
        view.setCenter(whCoordinate);
    }

    zoomBack = () => {
        const { mapObject, mapZoom, mapCenter, mapRotation } = this.state;
        const view  = mapObject.getView();
        view.setZoom(mapZoom);
        view.setCenter(mapCenter);
        view.setRotation(mapRotation);
    }

    render() {
        return (
          <PageHeaderWrapper title='地图操作'>
            <Card bordered={false}>
              <div id="mapControl-operation" className={styles.mapWrapper} />
              <div className={styles.ButtonArea}>
                <Button onClick={() => this.zoomOut()}>单击缩小</Button>
                <Button onClick={() => this.zoomIn()}>单击放大</Button>
                <Button onClick={() => this.zoomWuHan()}>平移到【武汉】</Button>
                <Button onClick={() => this.zoomBack()}>复位</Button>
              </div>
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default Operation;