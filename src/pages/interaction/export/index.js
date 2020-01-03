import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import extPrint from 'ol-ext/control/Print'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
	Card,
	Button
  } from 'antd';
import styles from './index.less'
// 在layouts下的BasicLayout.js文件中全局引入了ol.css,所以这里不用再引入
//基于ol-ext，jspdf，file-saver


class ExoportPicPdf extends React.Component {

	state = {
		printControl: null
	}

    componentDidMount() {
        this.initControl();
    }

    initControl = () => {
        var map = new Map({
            target: 'interaction-ExoportPicPdf',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [12900000, 4900000],
                zoom: 8
            })
		});
		this.addExportMethod(map);
    }

	//挂载打印组件
    addExportMethod = (map) => {
        // Print control
        var printControl = new extPrint();
        map.addControl(printControl);

        printControl.on(['print', 'error'], function(e) {
            // Print success
            if (e.image) {
              	if (e.pdf) {
					// Export pdf using the print info
					var pdf = new jsPDF({
						orientation: e.print.orientation,
						unit: e.print.unit,
						format: e.print.format
					});
					pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
					pdf.save();
              	} else  {
					e.canvas.toBlob(function(blob) {
						saveAs(blob, 'map.'+e.imageType.replace('image/',''));
					}, e.imageType);
					//$('#image img').attr('src', e.image);
              	}
            } else {
              	console.warn('No canvas to export');
            }
		});
		this.setState({
			printControl: printControl
		})
	}
	
	//导出方法
	exportMethod=(arg) => {
		const { printControl } = this.state;
		printControl.print(arg);
	}

    render() {
        return (
          <PageHeaderWrapper title='地图导出'>
            <Card bordered={false}>
              <div id="interaction-ExoportPicPdf" className={styles.mapWrapper}>
			  <div className={styles.formInput}>
					<Button type="primary" ghost onClick={() => this.exportMethod({ imageType: 'image/jpeg'})}>导出JPEG</Button>
    				<Button style={{marginLeft:8, color: 'black', borderColor: 'black'}} onClick={() => this.exportMethod({ imageType: 'image/png'})} ghost>导出PNG</Button>
					<Button style={{marginLeft:8}} type="danger" onClick={() => this.exportMethod({ imageType: 'image/jpeg', pdf:true })} ghost>导出PDF</Button>
				</div>
			  </div>
            </Card>
          </PageHeaderWrapper>
        )
    }
}
export default ExoportPicPdf;