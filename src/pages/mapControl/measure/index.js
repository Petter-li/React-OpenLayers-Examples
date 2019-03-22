import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import mapStyle from 'ol/style/Style';
import mapFill from 'ol/style/Fill';
import mapStroke from 'ol/style/Stroke';
import mapCircle from 'ol/style/Circle';
import sphere from 'ol/sphere'
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
    Select,
    Checkbox,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入


class Measure extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        let map = new Map({
            target: 'mapControl-measure',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 4
            })
        });
        //加载测量的绘制矢量层
        let source = new VectorSource(); //图层数据源
        let Vector = new VectorLayer({
            source: source,
            style: new mapStyle({ //图层样式
                fill: new mapFill({
                    color: 'rgba(255, 255, 255, 0.2)' //填充颜色
                }),
                stroke: new mapStroke({
                    color: '#ffcc33', //边框颜色
                    width: 2 //边框宽度
                }),
                image: new mapCircle({
                    radius: 7,
                    fill: new mapFill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        map.addLayer(Vector);

        let wgs84Sphere = new sphere(6378137); //定义一个球对象

        let sketch, //当前绘制的要素
        helpTooltipElement, //帮助提示框对象
        helpTooltip, //帮助提示框显示信息
        measureTooltipElement, //测量工具提示框对象
        measureTooltip, //测量工具中显示的测量值
        continuePolygonMsg='点击继续绘制多边形', //当用户正在绘制多边形时的提示信息文本
        continueLineMsg='点击继续绘制线条'; //当用户正在绘制线时的提示信息文本

        //鼠标移动事件的处理函数
        let pointerMoveHandler = (evt) => {
            if(evt.dragging) {
                return; 
            }
            let helpMsg = '点击开始绘制';
            if(sketch) {
                let geom = (sketch.getGeometry());
                if(geom instanceof Polygon) {
                    helpMsg = continuePolygonMsg;
                }else if(geom instanceof LineString) {
                    helpMsg = continueLineMsg;
                }
                helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
                helpTooltip.setPosition(evt.coordinate);//设置帮助提示框的位置
                //$(helpTooltipElement).removeClass('hidden');//移除帮助提示框的隐藏样式进行显示
            }
        }

        map.on('pointermove', pointerMoveHandler);
    }

    render() {
        return (
          <PageHeaderWrapper title='测量控件'>
            <Card bordered={false}>
                <div id="mapControl-measure" className={styles.mapWrapper}>
                    <div className={styles.menuC}>
                        <label>Geometry type &nbsp;</label>
                        <Select style={{width: 120}} defaultValue='length' dropdownStyle={{zIndex: 2001}}>
                            <Select.Option value="length">length</Select.Option>
                            <Select.Option value="area">area</Select.Option>
                        </Select>
                        <br />
                        <label className={styles.checkbox}>
                            <Checkbox><span style={{color: '#fff'}}>use geodesic measures</span></Checkbox>
                        </label>
                    </div>
                </div>
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default Measure;