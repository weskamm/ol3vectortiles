/**
 * Main Application
 */


/**
 * The threshold for labeling streets. Higher value means less labels
 */
var labelThreshold = 8;

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

    this.roads = new ol.layer.Image({
        name: 'roads',
        source: new ol.source.ImageVector({
            updateVectorsWhileAnimating: true,
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-roads/{z}/{x}/{y}.topojson'
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
                } else if (scale > 100000) {
                    style = style_roads_100000_250000;
                } else if (scale > 35000) {
                    style = style_roads_35000_100000;
                } else if (scale > 15000) {
                    style = style_roads_15000_35000;
                } else if (scale > 2500) {
                    style = style_roads_2500_15000;
                } else {
                    style = style_roads_0_2500;
                }

                // try to detect the style
                if (style.style[type]) {
                    return buildRoadStyle(feature, resolution, style);
                }
            },
            attributions: [attribution]
        })
    });

    this.buildings = new ol.layer.Image({
        name: 'buildings',
        minResolution: 0,
        maxResolution: 2.388657133911758, // ~ 1:8530, level 16
        source: new ol.source.ImageVector({
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-buildings/{z}/{x}/{y}.topojson'
            }),
            style: (function() {

                return function(feature, resolution) {
                    var text = feature.get('name');
                    return [new ol.style.Style({
                        fill: new ol.style.Fill({
                          color: '#D1D1D1'
                        }),
                        stroke: new ol.style.Stroke({
                          color: '#B3B3B3'
                        })
                    })];
                };
            })(),
            attributions: [attribution]
        })
    });

    this.waterways = new ol.layer.Image({
        name: 'waterways',
        minResolution: 0,
        maxResolution: 152.8740565703525, // ~ 1:545977, level 10
        source: new ol.source.ImageVector({
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-waterways/{z}/{x}/{y}.topojson'
            }),
            style: (function() {
                return function(feature, resolution) {
                    return [new ol.style.Style({
                      fill: new ol.style.Fill({
                        color: '#99B3CC'
                      }),
                      stroke: new ol.style.Stroke({
                        color: '#99B3CC'
                      })
                    })];
                };
            })(),
            attributions: [attribution]
        })
    });

    this.waterareas = new ol.layer.Image({
        name: 'waterareas',
        minResolution: 0,
        maxResolution: 305.748113140705, // ~ 1:1091955, level 9
        source: new ol.source.ImageVector({
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-waterareas/{z}/{x}/{y}.topojson'
            }),
            style: (function() {
                return function(feature, resolution) {
                    return [new ol.style.Style({
                      fill: new ol.style.Fill({
                        color: '#99B3CC'
                      }),
                      stroke: new ol.style.Stroke({
                          color: '#99B3CC'
                      })
                    })];
                };
            })(),
            attributions: [attribution]
        })
    });

    this.landusage = new ol.layer.Image({
        name: 'landusage',
        minResolution: 0,
        maxResolution: 152.8740565703525, // ~ 1:545977, level 10
        source: new ol.source.ImageVector({
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-landusage/{z}/{x}/{y}.topojson'
            }),
            style: function(feature, resolution) {

                var props = feature.getProperties(),
                type = props.type || null;

                // try to detect the style
                if (style_landusage.style[type]) {
                    return buildLanduseStyle(feature, type, resolution, style_landusage);
                }
            },
            attributions: [attribution]
        })
    });

    this.places = new ol.layer.Image({
        name: 'places',
        source: new ol.source.ImageVector({
            ratio: 1,
            source: new ol.source.TileVector({
                format: new ol.format.TopoJSON({
                    defaultProjection: 'EPSG:3857'
                }),
                projection: 'EPSG:3857',
                tileGrid: new ol.tilegrid.createXYZ({
                    minZoom: 0,
                    maxZoom: 19
                }),
                url: 'http://ows.terrestris.de/vectortiles/osm-places/{z}/{x}/{y}.topojson'
            }),
            style: (function() {

                return function(feature, resolution) {
                    var text = feature.get('name'),
                        type = feature.get('type'),
                        font = 'px Calibri,sans-serif';

                    if (type === 'country') {
                        font = 16 + font;
                    } else if (type === 'city') {
                        font = 14 + font;
                    } else if (type === 'town') {
                        font = 12 + font;
                    } else if (type === 'village') {
                        font = 10 + font;
                    }

                    return [new ol.style.Style({
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
                        })
                    })];
                };
            })(),
            attributions: [attribution]
        })
    });

    layers.push(landusage,waterareas,waterways,buildings,roads,places,osmwms);
    return layers;
};

/**
 * Create OL interaction to select features
 */
var createInteractions = function(layers) {
    var actions = [],
        layersToHover = ['roads', 'buildings', 'waterways', 'landusage'],
        olLayersToHover = [];

    for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layersToHover.length; j++) {
            if (layers[i].get('name') === layersToHover[j]) {
                olLayersToHover.push(layers[i]);
            }
        }
    }

    var selectMouseMove = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: olLayersToHover
    });
    actions.push(selectMouseMove);

    return actions;
};

/**
 * Create the OL map with the given layers and interactions
 */
var createMap = function(layers,actions) {
    var map = new ol.Map({
        renderer: 'canvas',
        layers: [new ol.layer.Group({
            layers: layers
        })],
        target: 'map',
        view: new ol.View({
            center: [847316.1308811717, 6793531.649854118],
            zoom: 16
        }),
        controls: ol.control.defaults({
            attributionOptions: ({
               collapsible: false
            })
        }),
        loadTilesWhileInteracting: true,
        loadTilesWhileAnimating: true,
        interactions: ol.interaction.defaults().extend(actions)
    });

    return map;
};

/**
 * Register the relevant map and DOM listeners
 */
var registerListeners = function(map) {

    map.on('moveend', function() {
        updateStatistics(roads);
        updateStatistics(buildings);
        updateStatistics(landusage);
    });

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
            roads.unByKey(graylistener);
            map.render();
            graylistener = undefined;
        }
    });

    var styleFeaturesBox = document.getElementById('stylefeatures'),
        styler = document.getElementById('stylecontainer');

    styleFeaturesBox.onchange = function(evt) {
        if (styleFeaturesBox.checked) {
            if ($('.minicolors-input').length === 0) {
                $('#colorpicker').minicolors({
                    control: 'wheel',
                    inline: true,
                    change: function(hex) {
                        handleFeatureSelection(hex);
                    }
                });
            }
            styler.style.display = 'block';
        } else {
            styler.style.display = 'none';
        }
    };
};

/**
 * Method handles the styling of features after a color has been selected
 */
var handleFeatureSelection = function(hex) {

    var selectCtrl = map.getInteractions().getArray().
        filter(function(i){return i instanceof ol.interaction.Select;})[0],
        selectedFeature = selectCtrl.getFeatures().getArray()[0];

    if (selectedFeature) {
        var type = selectedFeature.get('type'),
            lArr = map.getLayers().getArray()[0].getLayers(),
            layer;

        // determine the layer
        lArr.forEach(function(l) {
            if (l instanceof ol.layer.Image && l.getVisible()) {
                var feats = l.getSource().getSource().getFeatures();
                for (var i = 0; i < feats.length; i++) {
                    if (feats[i] === selectedFeature) {
                        layer = l;
                        break;
                    }
                }
            }
        });

        if (layer === buildings) {
            layer.getSource().setStyle([new ol.style.Style({
                fill: new ol.style.Fill({
                  color: hex
                }),
                stroke: new ol.style.Stroke({
                  color: '#B3B3B3'
                })
            })]);
        } else if (layer === landusage) {
            style_landusage.style[type].colors.pop();
            style_landusage.style[type].colors.push(hex);
        } else if (layer === roads) {
            style_roads_0_2500.style[type].colors.pop();
            style_roads_0_2500.style[type].colors.push(hex);
            style_roads_2500_15000.style[type].colors.pop();
            style_roads_2500_15000.style[type].colors.push(hex);
            style_roads_15000_35000.style[type].colors.pop();
            style_roads_15000_35000.style[type].colors.push(hex);
            style_roads_35000_100000.style[type].colors.pop();
            style_roads_35000_100000.style[type].colors.push(hex);
        }

        layer.getSource().changed();
    }
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
        text = props.name || null;

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

    // check if we can label this road
    if (getCurrentScale() < 100000 &&
        text &&
        text.length > 0 &&
        feature instanceof ol.Feature &&
        feature.get('geometry') &&
        feature.get('geometry') instanceof ol.geom.LineString &&
        feature.get('geometry').getLength() &&
        (feature.get('geometry').getLength() / resolution) / text.length > labelThreshold) {

            var coords = feature.get('geometry').getCoordinates(),
                offsetX = 0,
                offsetY = 0,
                longestSegment;

            // first we check if the linestring contains multiple segments
            // as in this case we will render the textlabel on the longest segment
            if (coords.length > 1) {

                for (var i = 0; i < coords.length - 1; i++) {
                    // get the length for each segment
                    var segment = new ol.Feature({
                        geometry: new ol.geom.LineString([[coords[i][0], coords[i][1]],[coords[i+1][0], coords[i+1][1]]])
                    });

                    if (longestSegment instanceof ol.Feature) {
                        if (longestSegment.getGeometry().getLength() < segment.getGeometry().getLength()) {
                            longestSegment = segment;
                        }
                    } else {
                        longestSegment = segment;
                    }
                }
                // recheck if we are still in threshold
                if (!(longestSegment.get('geometry').getLength() / resolution > labelThreshold)) {
                    return styleArray;
                }

                longestSegment.set('z_order', feature.get('z_order'));

                var origLabelCenter = map.getPixelFromCoordinate(feature.getGeometry().getFlatMidpoint()),
                    newLabelCenter =  map.getPixelFromCoordinate(longestSegment.getGeometry().getFlatMidpoint());

                offsetX = -1*(origLabelCenter[0]-newLabelCenter[0]);
                offsetY = -1*(origLabelCenter[1]-newLabelCenter[1]);

                feature = longestSegment;

            }

            // at this stage we should have a linestring with just an start and endpoint

            coords = feature.get('geometry').getCoordinates();
            var start = coords[0],
                end = coords[coords.length-1],
                y = end[1] - start[1],
                x = end[0] - start[0],
                angle = Math.atan2(x,y),
                degrees = 360-(angle*180/Math.PI)-90;


            // avoid bad values for radians
            if (degrees > 360) {
                degrees = 360 - degrees;
            }
            // flipping degrees until we are only between -90 and 90 degrees
            // for readability reasons
            while (degrees > 90 || degrees < -90) {
                if (degrees > 90) {
                    degrees = 180 - degrees;
                } else if (degrees < -90) {
                    degrees = 180 + degrees;
                }
            }
            var radians = degrees * (Math.PI/180);

            var textStroke = new ol.style.Stroke({
                color: '#fff',
                width: 3
            });
            var textFill = new ol.style.Fill({
                color: '#000'
            });
            var textStyle = new ol.style.Style({
                text: new ol.style.Text({
                    font: '11px Calibri,sans-serif',
                    text: text,
                    fill: textFill,
                    rotation: radians,
                    stroke: textStroke,
                    offsetX: offsetX,
                    offsetY: offsetY
                }),
                zIndex: feature.get('z_order') + 999 || 999 // labels always on top :-)
            });
            styleArray.push(textStyle);
    }
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
 * Updates the statistic values of loaded and visible features
 */
var updateStatistics = function(layer) {

    var allFeatures = layer.getSource().getSource().getFeatures(),
        mapExtent = map.getView().calculateExtent(map.getSize()),
        layerVisible = layer.getVisible(),
        featureCount = allFeatures.length,
        pointsPairCount = 0,
        currentLength,
        visibleFeatureCount = 0,
        visiblePointsPairCount = 0;

    for (i = 0; i < allFeatures.length; i++) {
        var g = allFeatures[i].getGeometry();
        if (g.getCoordinates() instanceof Array) {
            currentLength = g.getCoordinates()[0].length;
        } else {
            currentLength = g.getCoordinates().length;
        }
        pointsPairCount = pointsPairCount + currentLength;

        if (g.intersectsExtent(mapExtent)) {
            if (layer.getMaxResolution() > map.getView().getResolution()) {
                // layer in render range, increment visible values) {
                visibleFeatureCount++;
                visiblePointsPairCount = visiblePointsPairCount + currentLength;
            } else {
                visibleFeatureCount = 0;
                visiblePointsPairCount = 0;
            }
        }
    }

    var coordpairs = document.getElementsByName("coordinatepairs" + layer.get('name'))[0],
        vectors = document.getElementsByName("vectors" + layer.get('name'))[0],
        coordpairsvisible = document.getElementsByName("coordinatepairs" + layer.get('name') + "visible")[0],
        vectorsvisible = document.getElementsByName("vectors" + layer.get('name') + "visible")[0];

    coordpairs.innerHTML = pointsPairCount + " Coords";
    vectors.innerHTML = featureCount + " Features";

    coordpairsvisible.innerHTML = visiblePointsPairCount + " Coords";
    vectorsvisible.innerHTML = visibleFeatureCount + " Features";

    allFeatures = null;

};

/**
 * Setup the app, instanciate the map
 */

var layers = createLayers(),
    actions = createInteractions(layers),
    map = createMap(layers, actions);

registerListeners(map);
