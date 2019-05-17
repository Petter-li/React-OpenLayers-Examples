import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJson from 'ol/format/GeoJson';
import KML from 'ol/format/KML';
/* eslint-disable */
import GeoJsonData from '@/assets/data/geojson/countries.geojson';
import KmlData from '@/assets/data/kml/2012_Earthquakes_Mag5.kml'
/* eslint-disable */
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
    Checkbox
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class LayersC extends React.Component {
    state = {
        layers: []
    }

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const map = new Map({
            target: 'mapControl-layers',
            layers: [
                new TileLayer({
                    source: new OSM(),
                    name: '世界地图(OSM瓦片)'
                }),
                new VectorLayer({
                    source: new VectorSource({
                        url: GeoJsonData,
                        format: new GeoJson(),
                    }),
                    name: '国界(JSON格式矢量图)'
                }),
                new VectorLayer({  
                    source: new VectorSource({
                        url: KmlData,
                        format: new KML({ extractStyles: false}),
                    }),
                    name: '点(KML格式矢量图)'
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });
        const mapLayers = map.getLayers();
        this.setState({
            layers: new Array(mapLayers.getLength()).fill(1).map((e,i) => ({'name': mapLayers.item(i).get('name'), layer: mapLayers.item(i)}))
        })
    }

    changeVisible = (layer, checked) => {
        console.log(layer);
        layer.setVisible(checked);
    }

    render() {
        const { layers } = this.state;
        return (
          <PageHeaderWrapper title='图层控件'>
            <Card bordered={false}>
              <div className={styles.layerControl}>
                <div className={styles.title}><span>图层列表</span></div>
                <ul className={styles.layerTree}>
                  {layers.map(item => <li key={item.name}>
                    <Checkbox onChange={(e) => this.changeVisible(item.layer,e.target.checked)} defaultChecked value={item.layer}><span style={{color:' #ffffff'}}>{item.name}</span></Checkbox>
                    </li>)}
                </ul>
              </div>
              <div id="mapControl-layers" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default LayersC;