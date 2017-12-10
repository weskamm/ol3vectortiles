/**
 * Main Application
 */

 var useDeclutter = false;

 var map;

/**
 * Create layers for the OL map
 */
var createLayers = function(map) {
    this.map = map;
    var layers = [],
    attribution = new ol.Attribution({
        html: '© terrestris GmbH & Co. KG<br>' +
        'Data © OpenStreetMap <a href="http://www.openstreetmap.org/copyright/en" target="_blank">contributors</a>'
    });

    var labelTextStroke = new ol.style.Stroke({
        color: '#fff',
        width: 3
    });
    var labelTextFill = new ol.style.Fill({
        color: '#000'
    });
    this.labelStyle = new ol.style.Style({
        text: new ol.style.Text({
            font: '13px sans-serif',
            fill: labelTextFill,
            stroke: labelTextStroke,
            placement: 'line'
        })
    });

    this.countries = new ol.layer.VectorTile({
        name: 'country_boundaries_50m',
        renderMode: 'image',
        declutter: useDeclutter,
        //maxResolution: 35,
        source: new ol.source.VectorTile({
             format: new ol.format.MVT(),
            tileGrid: ol.tilegrid.createXYZ({
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:country_boundaries_50m_no_limit' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_countries, 'polygon');
        }
    });

    this.roads = new ol.layer.VectorTile({
        name: 'roads',
        renderMode: 'image',
        declutter: useDeclutter,
        source: new ol.source.VectorTile({
             format: new ol.format.MVT(),
            tileGrid: ol.tilegrid.createXYZ({
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_roads' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_roads, 'line');
        }
    });

    this.buildings = new ol.layer.VectorTile({
        name: 'buildings',
        renderMode: 'image',
        minResolution: 0,
        maxResolution: 3,
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tilePixelRatio: 1, // oversampling when > 1
            tileGrid: ol.tilegrid.createXYZ({
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_buildings' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_buildings, 'polygon');
        }
    });

    this.waterways = new ol.layer.VectorTile({
        name: 'waterways',
        renderMode: 'image',
        declutter: useDeclutter,
        minResolution: 0,
        maxResolution: 152.8740565703525, // ~ 1:545977, level 10
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tilePixelRatio: 1, // oversampling when > 1
            tileGrid: ol.tilegrid.createXYZ({
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_waterways' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_waterways, 'line');
        }
    });

    this.waterareas = new ol.layer.VectorTile({
        name: 'waterareas',
        renderMode: 'image',
        declutter: useDeclutter,
        minResolution: 0,
        maxResolution: 305.748113140705, // ~ 1:1091955, level 9
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tilePixelRatio: 1, // oversampling when > 1
            tileGrid: ol.tilegrid.createXYZ({
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_waterareas' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_waterareas, 'polygon');
        }
    });

    this.landusage = new ol.layer.VectorTile({
        name: 'landusage',
        renderMode: 'image',
        minResolution: 0,
        maxResolution: 152.8740565703525, // ~ 1:545977, level 10
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tileGrid: ol.tilegrid.createXYZ({
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_landusages' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            return buildStyle(feature, resolution, style_landusage, 'polygon');
        }
    });

    this.places = new ol.layer.VectorTile({
        name: 'places',
        renderMode: 'image',
        declutter: true,
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tileGrid: new ol.tilegrid.createXYZ({
                minZoom: 0,
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_places_vector' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            var text = feature.get('name'),
                type = feature.get('type'),
                font = 'px sans-serif',
                zIndex;

            if (type === 'country') {
                font = 18 + font;
                zIndex = 9999;
            } else if (type === 'city') {
                font = 16 + font;
                zIndex = 9998;
            } else if (type === 'town') {
                font = 15 + font;
                zIndex = 9997;
            } else if (type === 'village') {
                font = 14 + font;
                zIndex = 9996;
            }

            var style =  [new ol.style.Style({
                text: new ol.style.Text({
                    font: font,
                    text: text,
                    fill: new ol.style.Fill({
                        color: '#000',
                        width: 3
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 5
                    })
                }),
                zIndex: zIndex
            })];
            return style;
        }
    });

    layers.push(landusage,waterareas,waterways,countries,buildings,roads,places);
    map.getView().on('change:resolution', function(evt) {
        var res = evt.target.getResolution();
        if (res <= 9 && evt.oldValue > 9) {
            this.landusage.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_landusages' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        } else if (res > 9 && evt.oldValue <= 9) {
            this.landusage.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_landusages_gen0_no_limit' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        }
        if (res <= 35 && evt.oldValue > 35) {
            this.roads.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_roads' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        } else if (res > 35 && evt.oldValue <= 35) {
          this.roads.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_roads_gen0' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        }
        if (res <= 38 && evt.oldValue > 38) {
            this.waterareas.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_waterareas' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        } else if (res > 38 && evt.oldValue <= 38) {
          this.waterareas.getSource().setUrl('http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_waterareas_gen0_no_limit' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf');
        }
    }.bind(this));

    return layers;
};

/**
 * Creates the dynamic style for roads
 */
var buildStyle = function(feature, resolution, styleArray, geom) {
    if (!styleArray) {
      return null;
    }

    var props = feature.getProperties(),
        type = props.type || null,
        text = props.name || props.ref || null,
        isHighWay = props.type === 'motorway' && props.class === 'highway' && props.ref.indexOf("A") > -1,
        styleToUse;

    styleArray.forEach(function(el) {
        if (el.minResolution <= resolution && el.maxResolution >= resolution) {
            styleToUse = el.style;
        }
    });
    if (!styleToUse || !styleToUse[type]) {
      return null;
    }
    var style = [];
    if (geom === 'line') {
        var below = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: styleToUse[type].colors[0] || 'black',
                width: styleToUse[type].widths[0] || 2,
                lineCap: styleToUse[type].caps[0] || 'butt',
                opacity: styleToUse[type].opacity || 1,
                lineDash: styleToUse[type].dasharray ? styleToUse[type].dasharray.split(' ') : []
            }),
            zIndex: feature.get('z_order') || 0
        });
        style.push(below);

        // check if we need a "outline" for this road
        if (styleToUse[type].widths.length > 1) {
            var above = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: styleToUse[type].colors[1] || 'white',
                    width: styleToUse[type].widths[1] || 1,
                    lineCap: styleToUse[type].caps[1] || 'round',
                    opacity: styleToUse[type].opacity || 1
                }),
                zIndex: feature.get('z_order') + 1 || 1
            });
            style.push(above);
        }
    } else if (geom === 'polygon') {
        var polyStyle = new ol.style.Style({
          fill: (styleToUse[type].fillColor || styleToUse[type].fillOpacity) ?
              new ol.style.Fill({
                color: styleToUse[type].fillColor || 'blue',
                opacity: styleToUse[type].fillOpacity || 1
              }) : undefined,
          stroke: (styleToUse[type].strokeColor || styleToUse[type].strokeWidth) ?
              new ol.style.Stroke({
                  color: styleToUse[type].strokeColor || 'blue',
                  width: styleToUse[type].strokeWidth || 1,
                  lineCap: styleToUse[type].lineCap || 'round',
                  opacity: styleToUse[type].strokeOpacity || 1
              }) : undefined,
          zIndex: styleToUse[type].zIndex || (feature.get('z_order') || 3)
          // why 3? -> because we render park and wood on 1 and 2...
          // this is some 'fix' for handling weired or undefined z_order in osm data
        });
        style.push(polyStyle);
    }

    if (styleToUse[type].useLabels !== false) {
        labelStyle.getText().setFill(new ol.style.Fill({
            color: styleToUse[type].textFillColor || 'black',
            width: styleToUse[type].textFillWidth || 3
        }));
        labelStyle.getText().setStroke(new ol.style.Stroke({
            color: styleToUse[type].textStrokeColor || 'white',
            width: styleToUse[type].textStrokeWidth || 5
        }));
        labelStyle.getText().setPlacement(styleToUse[type].textPlacement || 'line');

        labelStyle.getText().setText(feature.get('name'));
        labelStyle.setZIndex(feature.get('z_order') + 999 || 999);
        style.push(labelStyle);
    }

    return style;
};
