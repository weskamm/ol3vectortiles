/**
 * Main Application
 */

/**
 * Create layers for the OL map
 */
var createLayers = function() {

    var layers = [],
    attribution = new ol.Attribution({
        html: '© terrestris GmbH & Co. KG<br>' +
        'Data © OpenStreetMap <a href="http://www.openstreetmap.org/copyright/en" target="_blank">contributors</a>'
    });

    this.osmwms = new ol.layer.Tile({
        visible: false,
        source: new ol.source.TileWMS(({
            url: 'http://ows.terrestris.de/osm/service',
            params: {'LAYERS': 'OSM-WMS'},
            attributions: [attribution]
        }))
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

    this.roads = new ol.layer.VectorTile({
        name: 'roads',
        renderMode: 'image',
        declutter: true,
        maxResolution: 35,//70,
        // renderBuffer: 100,
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
            var props = feature.getProperties(),
                type = props.type || null,
                style,
                scale = getCurrentScale();

            if (scale > 5000000) {
                style = style_roads_5000000_40000000;
            } else if (scale > 2500000) {
                style = style_roads_2500000_5000000;
            } else if (scale > 1000000) {
                style = style_roads_1000000_2500000;
            } else if (scale > 250000) {
                style = style_roads_250000_1000000;
            } else if (scale > 150000) {
                style = style_roads_150000_250000;
            } else if (scale > 100000) {
                style = style_roads_100000_150000;
            } else if (scale > 30000) {
                style = style_roads_30000_100000;
            } else if (scale > 15000) {
                style = style_roads_15000_30000;
            } else if (scale > 2500) {
                style = style_roads_2500_15000;
            } else {
                style = style_roads_0_2500;
            }

            // try to detect the style
            if (style.style[type]) {
                return buildRoadStyle(feature, resolution, style);
            } else {
              return null;
            }
        }
    });

    this.roads2 = new ol.layer.VectorTile({
        name: 'roads',
        renderMode: 'image',
        declutter: false,
        minResolution: 36,
        // maxResolution: 170,//70,
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tileGrid: ol.tilegrid.createXYZ({
                tileSize: [512,512] // prevent too much labels and collision
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_roads_gen0' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            var props = feature.getProperties(),
                type = props.type || null,
                style,
                scale = getCurrentScale();

              if (scale > 5000000) {
                  style = style_roads_5000000_40000000;
              } else if (scale > 2500000) {
                  style = style_roads_2500000_5000000;
              } else if (scale > 1000000) {
                  style = style_roads_1000000_2500000;
              } else if (scale > 250000) {
                  style = style_roads_250000_1000000;
              } else if (scale > 150000) {
                  style = style_roads_150000_250000;
              } else if (scale > 100000) {
                  style = style_roads_100000_150000;
              } else if (scale > 30000) {
                  style = style_roads_30000_100000;
              } else if (scale > 15000) {
                  style = style_roads_15000_30000;
              } else if (scale > 2500) {
                  style = style_roads_2500_15000;
              } else {
                  style = style_roads_0_2500;
              }

            // try to detect the style
            if (style.style[type]) {
                return buildRoadStyle(feature, resolution, style);
            } else {
              return null;
            }
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
            var text = feature.get('name');
            return [new ol.style.Style({
                fill: new ol.style.Fill({
                  color: '#D1D1D1'
                }),
                stroke: new ol.style.Stroke({
                  color: '#B3B3B3'
                  }),
                text: new ol.style.Text({
                    font: '14px sans-serif',
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 3
                    }),
                    text: text
                }),
                zIndex: 1000
            })];
        }
    });

    this.waterways = new ol.layer.VectorTile({
        name: 'waterways',
        renderMode: 'image',
        declutter: true,
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
            return [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#99B3CC'
                }),
                stroke: new ol.style.Stroke({
                    color: '#99B3CC'
                }),
                text: new ol.style.Text({
                    font: '13px sans-serif',
                    text: feature.get('name'),
                    fill: new ol.style.Fill({
                        color: '#003fff',
                        width: 3
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 5
                    }),
                    placement: 'line'
                }),
                zIndex: 9999
            })];
        }
    });

    this.waterareas = new ol.layer.VectorTile({
        name: 'waterareas',
        renderMode: 'image',
        declutter: true,
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
            return [new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#99B3CC'
                }),
                stroke: new ol.style.Stroke({
                    color: '#99B3CC'
                }),
                text: new ol.style.Text({
                    font: '12px sans-serif',
                    text: feature.get('name'),
                    fill: new ol.style.Fill({
                        color: '#003fff',
                        width: 3
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 5
                    })
                }),
                zIndex: 9999
            })];
        }
    });

    this.landusage = new ol.layer.VectorTile({
        name: 'landusage',
        renderMode: 'image',
        minResolution: 0,
        maxResolution: 152.8740565703525, // ~ 1:545977, level 10
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tilePixelRatio: 1, // oversampling when > 1
            tileGrid: ol.tilegrid.createXYZ({
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_landusages' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            var props = feature.getProperties(),
            type = props.type || null;

            // try to detect the style
            if (style_landusage.style[type]) {
                return buildLanduseStyle(feature, type, resolution, style_landusage);
            }
        }
    });

    this.places = new ol.layer.VectorTile({
        name: 'places',
        renderMode: 'image',
        declutter: true,
        // renderBuffer: 400,
        source: new ol.source.VectorTile({
            format: new ol.format.MVT(),
            tileGrid: new ol.tilegrid.createXYZ({
                minZoom: 0,
                maxZoom: 19,
                tileSize: [512,512]
            }),
            url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_places' +
                '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
            attributions: [attribution]
        }),
        style: function(feature, resolution) {
            var text = feature.get('name'),
                type = feature.get('type'),
                font = 'px sans-serif';

            if (type === 'country') {
                font = 17 + font;
            } else if (type === 'city') {
                font = 16 + font;
            } else if (type === 'town') {
                font = 15 + font;
            } else if (type === 'village') {
                font = 14 + font;
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
                zIndex: 9999
            })];
            return style;
        }
    });

    layers.push(landusage,waterareas,waterways,roads,roads2,buildings,places,osmwms);
    return layers;
};

/**
 * Create the OL map with the given layers and interactions
 */
var createMap = function(layers) {
    var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
            center: [789943.208725382, 6574238.796471646],
            zoom: 15,
            maxZoom: 20
        }),
        controls: ol.control.defaults({
            attributionOptions: ({
               collapsible: true
            })
        })
    });
    return map;
};

/**
 * Register the relevant map and DOM listeners
 */
var registerListeners = function(map) {

    var osmwmsvisibility = document.getElementById('osmwmsvisibility');
    osmwmsvisibility.addEventListener('change', function(){osmwms.setVisible(!osmwms.getVisible())});

    var roadsvisibility = document.getElementById('roadsvisibility');
    roadsvisibility.addEventListener('change', function(){roads.setVisible(!roads.getVisible())});

    var landusagevisibility = document.getElementById('landusagevisibility');
    landusagevisibility.addEventListener('change', function(){landusage.setVisible(!landusage.getVisible())});

    var buildingsvisibility = document.getElementById('buildingsvisibility');
    buildingsvisibility.addEventListener('change', function(){buildings.setVisible(!buildings.getVisible())});

    var waterwaysvisibility = document.getElementById('waterwaysvisibility');
    waterwaysvisibility.addEventListener('change', function(){waterways.setVisible(!waterways.getVisible())});

    var waterareasvisibility = document.getElementById('waterareasvisibility');
    waterareasvisibility.addEventListener('change', function(){waterareas.setVisible(!waterareas.getVisible())});

    var placesvisibility = document.getElementById('placesvisibility');
    placesvisibility.addEventListener('change', function(){places.setVisible(!places.getVisible())});

    var grayScaleBox = document.getElementById('rendergrayscale'),
        graylistener;

    grayScaleBox.addEventListener('change', function(evt) {
        if (grayScaleBox.checked) {
            if (!goog.isDef(graylistener)) {
                graylistener = roads.on('postcompose', function(evt) {
                    renderGrayScale(evt.context);
                });
            }
            map.render();
        } else {
            ol.Observable.unByKey(graylistener);
            map.render();
        }
    });
};

/**
 * getScale helper
 */
var getCurrentScale = function () {
    var view = map.getView(),
        resolution = view.getResolution(),
        units = map.getView().getProjection().getUnits(),
        dpi = 25.4 / 0.28,
        mpu = ol.proj.METERS_PER_UNIT[units],
        scale = resolution * mpu * 39.37 * dpi;
    return scale;
};

/**
 * Render the map in grayscale with canvas functions
 * see http://www.html5canvastutorials.com/advanced/html5-canvas-grayscale-image-colors-tutorial/
 * for reference
 */
var renderGrayScale = function(context) {
    var mapdiv = document.getElementById('map'),
        imageData = context.getImageData(0, 0, mapdiv.clientWidth, mapdiv.clientHeight),
        data = imageData.data;

    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      data[i] = brightness;
      data[i + 1] = brightness;
      data[i + 2] = brightness;
    }
    // overwrite original image
    context.putImageData(imageData, 0, 0);
};

/**
 * Creates the dynamic style for roads
 */
var buildRoadStyle = function(feature, resolution, styleObject) {

    var props = feature.getProperties(),
        type = props.type || null,
        text = props.name || props.ref || null,
        isHighWay = props.type === 'motorway' && props.class === 'highway' && props.ref.indexOf("A") > -1;

    var styleArray = [],
        below = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: styleObject.style[type].colors[0] || 'black',
                width: styleObject.style[type].widths[0] || 2,
                lineCap: 'butt',
                opacity: styleObject.style[type].opacity || 1,
                lineDash: styleObject.style[type].dasharray ? styleObject.style[type].dasharray.split(' ') : []
            }),
            zIndex: feature.get('z_order') || 0
        });

    styleArray.push(below);

    // check if we need a "outline" for this road
    if (styleObject.style[type].widths.length > 1) {
        var above = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: styleObject.style[type].colors[1] || 'white',
                width: styleObject.style[type].widths[1] || 1,
                lineCap: styleObject.style[type].caps[1] || 'round',
                opacity: styleObject.style[type].opacity || 1
            }),
            zIndex: feature.get('z_order') + 1 || 1
        });
        styleArray.push(above);
    }

    labelStyle.getText().setText(feature.get('name'));
    labelStyle.setZIndex(feature.get('z_order') + 999 || 999);
    styleArray.push(labelStyle);

    return styleArray;
};

/**
 * Creates the dynamic style for landusages
 */
var buildLanduseStyle = function(feature, type, resolution, styleObject) {
    return [new ol.style.Style({
        fill: new ol.style.Fill({
            color: styleObject.style[type].colors[0] || 'blue',
            opacity: styleObject.style[type].opacity || 1
        }),
        zIndex: styleObject.style[type].zIndex || (feature.get('z_order') || 3)
        // why 3? -> because we render park and wood on 1 and 2...
        // this is some 'fix' for handling weired or undefined z_order in osm data
    })];
};

/**
 * Setup the app, instanciate the map
 */

var layers = createLayers(),
    map = createMap(layers);

registerListeners(map);
