import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import mapStyle from 'ol/style/Style';
import mapStroke from 'ol/style/Stroke';
import mapFill from 'ol/style/Fill';
import MapUtils from '@/utils/mapUtils'
import extBar from 'ol-ext/control/Bar'
import extToggle from 'ol-ext/control/Toggle'
import extButton from 'ol-ext/control/Button'
import { transform } from 'ol/proj';
import GeoJson from 'ol/format/GeoJson';
import GeoJsonData from '@/assets/data/geojson/ChongqingCounty.geojson'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Card,
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入

/**
 * 绘制闭合图形，每绘制一次做为一个图层，方便对图层扩展，比如获取数据，撤销操作等
 * 引入ol-ext，做ol风格的自定义工具栏，在layouts下的BasicLayout.js文件中全局引入了ol-ext.css,
 * index.less中全局写本页面的CSS。webpack目录下需要区分ext中用的包来自Ol自身还是Ol-ext。
 * 官方demo: http://viglino.github.io/ol-ext/
 */


class selectMove extends React.Component {

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        const map = new Map({
            target: 'interaction-draw',
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
			type: 'originMap',
			name: '重庆边界图'
      	});
		map.addLayer(layer);
		this.addBar(map);
	}
	
	//添加自定义的工具栏
	addBar = (map) => {
		let _this = this;
		var mainbar = new extBar();
		map.addControl(mainbar);
		var nested = new extBar({ toggleOne: true, group:true });
		mainbar.addControl(nested);
		//绘画工具
		var selectCtrl = new extToggle(
			{	html: '<i class="fa fa-pencil"></i>',
				className: "draw",
				title: "绘制",
				active: false,
				onToggle: function(active){
					_this.draw(map,!!active);
				}
			}
		);
		//重置工具
		var resetCtrl = new extButton(
			{	html: '<i class="fa fa-refresh"></i>',
				className: "reset",
				title: "重置",
				handleClick: function(){
					selectCtrl.setActive(false);
					_this.draw(map, false);
					_this.clearMap(map);
				}
			}
		);
		nested.addControl(selectCtrl);
		nested.addControl(resetCtrl);
		mainbar.setPosition('top-left');
	}

	//绘制函数
    draw = (mapLayer, flag) => {
		if(!flag) {
            mapLayer.removeInteraction(this.drawer);
            this.drawer = null;
            return false;
        }
		const options = {
			color: '#FA3434', 
			zIndex:30,
		}
		const _this = this;
		let source = new VectorSource(); //图层数据源
        this.drawer = MapUtils.createDraw(source);
        mapLayer.addInteraction(this.drawer);
        

        //添加选区图层
        let opLayName = 'selfDraw'+new Date().getTime();
        let districtLayer = MapUtils.createDistrictLayer(source, {type: 'drawBySelf', opacity: 0.7, opLayName:opLayName, ...options});
        mapLayer.addLayer(districtLayer);

        //绘制完成时
        this.drawer.on('drawend', (evt) => {
            mapLayer.removeInteraction(this.drawer);
            this.drawer = null;
            //let polygon = evt.feature.getGeometry();
            setTimeout(() => {
                console.log('-------绘制完成----------')
                _this.draw(mapLayer, options);
            }, 100);
        });
	}
	
	//重置图层
	clearMap = (mapLayer) => {
        let layers = mapLayer.getLayers().getArray();
        for(let i = layers.length-1; i >= 0; i--) {
            let properties = layers[i].getProperties();
            if(!properties.type || (properties.type !== 'originMap')) {
                mapLayer.removeLayer(layers[i]);
            }
        }
	}
    

    render() {
        return (
          <PageHeaderWrapper title='绘制交互/ol-ext'>
            <Card bordered={false}>
              	<div id="interaction-draw" className={styles.mapWrapper} />
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default selectMove;