import * as Layer from 'ol/layer';
import * as OlStyles from 'ol/style';
import * as Interaction from 'ol/interaction';

export default {
    /**
     * 创建选区图层
     * @param source
     * @param color 图层填充颜色
     * @returns {VectorLayer}
    */
    createDistrictLayer: (source, options) => {
        return new Layer.Vector({
            // zIndex: 30,
            source: source,
            style: new OlStyles.Style({
                fill: new OlStyles.Fill({
                    color: options.color,
                })
            }),
            ...options,
            name: '落区绘制'
        });
    },
    /**
     * 创建多边形绘制工具
     * @param source
     * @param color 图层填充颜色
     * @returns {Draw}
    */
    createDraw: (source, options) => {
        return new Interaction.Draw({
            type: 'Polygon',
            freehand: true,
            source: source,
        });
    },
    //获取图片大小
    getImageSize: (map, bounds) => {
        let _min = [bounds[0], bounds[1]],
        _max = [bounds[2], bounds[3]];
        //_topLeft = [bounds[0], bounds[3]];
        let _scrMin = map.getPixelFromCoordinate(_min),
        _scrMax = map.getPixelFromCoordinate(_max);
        let _w = Math.round(_scrMax[0] - _scrMin[0]),
        _h = Math.round(_scrMin[1] - _scrMax[1]);
        return [_w, _h];
    },
}