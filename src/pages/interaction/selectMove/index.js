import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import mapStyle from 'ol/style/Style';
import mapStroke from 'ol/style/Stroke';
import mapFill from 'ol/style/Fill';
import interactionSelect from 'ol/interaction/Select';
import { pointerMove } from 'ol/events/condition';
import { transform } from 'ol/proj';
import GeoJson from 'ol/format/GeoJson';
import GeoJsonData from '@/assets/data/geojson/ChongqingCounty.geojson'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class selectMove extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const map = new Map({
            target: 'interaction-selectMove',
            view: new View({
                center: transform([108.25, 30.13550], 'EPSG:4326', 'EPSG:3857'),
                zoom: 7,
                zoomFactor: 2.04,
            })
        });
        this.addLayerMethod(map);
    }

    addLayerMethod = (map) => {
      let layer = new VectorLayer({
          source: new VectorSource({
              url: GeoJsonData,
              format: new GeoJson(),
          }),
          style: new mapStyle({
              stroke: new mapStroke({ //边界样式  
                  color: 'black',
                  width: 3,
              }),
              fill:new mapFill(
                { color: 'rgba(255,255,255,0.1)' }
              ),
          }),
          zIndex:32,
          name: '重庆边界图'
      });
      this.getCountyMove(map, layer);
      map.addLayer(layer);
    }

    getCountyMove(map, mapLayer){
        // 地图的移动事件
        let selectPointerMove = new interactionSelect({
          layers:[mapLayer],
          condition : pointerMove,
          style:function(feature,fbl){
            return new mapStyle({
              fill:new mapFill(
                { color: 'rgba(0,0,0,0.6)' }
              ),
              stroke: new mapStroke({
                color: 'blue',
                width: 2
              }),
            }); 
          },
        });
        
        //移入feature时触发的事件
        /* selectPointerMove.on('select', function(e) { 
          var features = e.selected;
          if(features.length > 0) {
          }
        }); */
        
        map.addInteraction(selectPointerMove);
    }

    render() {
        return (
          <PageHeaderWrapper title='选择交互'>
            <Card bordered={false}>
              <div id="interaction-selectMove" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default selectMove;