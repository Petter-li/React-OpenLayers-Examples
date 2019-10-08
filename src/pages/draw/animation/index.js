import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import {unByKey} from 'ol/Observable';
import {easeOut} from 'ol/easing';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import {OSM, Vector as VectorSource} from 'ol/source';
import * as OlStyle from 'ol/style';
import {Circle as CircleStyle, Stroke, Style, Icon} from 'ol/style';
//import {getVectorContext} from 'ol/render';
/* eslint-disable */
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import lightSrc from '@/assets/img/a.png'
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class LayersC extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        this.animation();
    }

    animation = () => {
        let tileLayer = new TileLayer({
            source: new OSM({
              wrapX: false
            })
        });
        const map = new Map({
            target: 'draw-customAnimation',
            layers: [
                tileLayer
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
                multiWorld: true
            })
        });
        var source = new VectorSource({
            wrapX: false
        });
        var vector = new VectorLayer({
            source: source
        });

        map.addLayer(vector);

        function addRandomFeature() {
            var x = Math.random() * 360 - 180;
            var y = Math.random() * 180 - 90;
            var geom = new Point(fromLonLat([x, y]));
            var feature = new Feature(geom);
            source.addFeature(feature);
        }
          
        var duration = 3000;
        function flash(feature) {
            var start = new Date().getTime();
            let flag = false;
            var listenerKey = tileLayer.on('postcompose', animate);
          
            function animate(event) {
                //var vectorContext = getVectorContext(event);
                const vectorContext = event.vectorContext;
                var frameState = event.frameState;
                var flashGeom = feature.getGeometry().clone();
                var elapsed = frameState.time - start;
                var elapsedRatio = elapsed / duration;
                // radius will be 5 at start and 30 at end.
                //var radius = easeOut(elapsedRatio) * 25 + 5;
                var opacity = easeOut(1 - elapsedRatio);
                if(!flag && opacity < 0.7) {
                    flag = true;
                    opacity = 1;
                }
                /* var style = new Style({
                    image: new CircleStyle({
                        radius: radius,
                        stroke: new Stroke({
                            color: 'rgba(255, 0, 0, ' + opacity + ')',
                            width: 0.25 + opacity
                        })
                    })
                }); */

                var img2 = new Image();
                img2.src = lightSrc;

                var style = new Style({
                    image: new OlStyle.Icon({
                        //src: lightSrc,
                        offset: [1,-2],
                        imgSize: [40,40],
                        img:img2,
                        opacity: opacity > 0 ? opacity : 0,
                    })
                });

                style.getImage().load();
                vectorContext.setStyle(style);
                vectorContext.drawGeometry(flashGeom);
                if (elapsed > duration) {
                    unByKey(listenerKey);
                    return;
                }
                // tell OpenLayers to continue postrender animation
                map.render();
            }
        }

        source.on('addfeature', function(e) {
            flash(e.feature);
        });
        
        let count = 0;
        function addAnimation() {
            count++;
            if(count < 20) {
                window.setTimeout(() => {
                    addRandomFeature();
                    addAnimation();
                }, 1000);
            }
        }
        addAnimation();
        //addRandomFeature();
        //window.setInterval(addRandomFeature, 1000);
    }

    render() {
        return (
          <PageHeaderWrapper title='图标闪烁'>
            <Card bordered={false}>
              <div id="draw-customAnimation" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default LayersC;