/**
 * Main Application
 */


/**
 * The threshold for labeling streets. Higher value means less labels
 */
var labelThreshold = 1;

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
        renderMode: 'image',
        maxResolution: 70,
        renderBuffer: 100,
        source: new ol.source.VectorTile({
          format: new ol.format.MVT({
            featureClass: ol.Feature
          }),
          tilePixelRatio: 1,
          tileGrid: ol.tilegrid.createXYZ({
            minZoom: 11,
            maxZoom: 19,
            tileSize: [512,512] // prevent too much labels and collision
          }),
          url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_roads' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
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
        maxResolution: 5,
        source: new ol.source.VectorTile({
          format: new ol.format.MVT(),
          tilePixelRatio: 1, // oversampling when > 1
          tileGrid: ol.tilegrid.createXYZ({
            maxZoom: 19,
            tileSize: [512,512]
          }),
          url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_buildings' +
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf'
            // format: new ol.format.TopoJSON({
            //     defaultProjection: 'EPSG:3857'
            // }),
            // projection: 'EPSG:3857',
            // tileGrid: new ol.tilegrid.createXYZ({
            //     minZoom: 0,
            //     maxZoom: 19
            // }),
            // url: 'http://ows.terrestris.de/vectortiles/osm-buildings/{z}/{x}/{y}.topojson'
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
    });

    this.waterways = new ol.layer.Image({
        name: 'waterways',
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
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf'
            // format: new ol.format.TopoJSON({
            //     defaultProjection: 'EPSG:3857'
            // }),
            // projection: 'EPSG:3857',
            // tileGrid: new ol.tilegrid.createXYZ({
            //     minZoom: 0,
            //     maxZoom: 19
            // }),
            // url: 'http://ows.terrestris.de/vectortiles/osm-waterways/{z}/{x}/{y}.topojson'
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
    });

    this.waterareas = new ol.layer.Image({
        name: 'waterareas',
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
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf'
            // format: new ol.format.TopoJSON({
            //     defaultProjection: 'EPSG:3857'
            // }),
            // projection: 'EPSG:3857',
            // tileGrid: new ol.tilegrid.createXYZ({
            //     minZoom: 0,
            //     maxZoom: 19
            // }),
            // url: 'http://ows.terrestris.de/vectortiles/osm-waterareas/{z}/{x}/{y}.topojson'
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
    });

    this.landusage = new ol.layer.Image({
        name: 'landusage',
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
              '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf'
            // format: new ol.format.TopoJSON({
            //     defaultProjection: 'EPSG:3857'
            // }),
            // projection: 'EPSG:3857',
            // tileGrid: new ol.tilegrid.createXYZ({
            //     minZoom: 0,
            //     maxZoom: 19
            // }),
            // url: 'http://ows.terrestris.de/vectortiles/osm-landusage/{z}/{x}/{y}.topojson'
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
        renderMode: 'image',
        // renderBuffer: 400,
        source: new ol.source.VectorTile({
            format: new ol.format.TopoJSON({
                defaultProjection: 'EPSG:3857'
            }),
            // format: new ol.format.MVT(),
            // tilePixelRatio: 1, // oversampling when > 1
            // tileGrid: ol.tilegrid.createXYZ({maxZoom: 19}),
            // url: 'http://localhost/geoserver/gwc/service/tms/1.0.0/' + 'osm:osm_places' +
            //     '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf'
            // projection: 'EPSG:3857',
            // tileGrid: new ol.tilegrid.TileGrid({
            //     extent: ol.proj.get('EPSG:3857').getExtent(),
            //     minZoom: 0,
            //     maxZoom: 19,
            //     tileSize: 512
            //   }),
            tileGrid: new ol.tilegrid.createXYZ({
                minZoom: 0,
                maxZoom: 19,
                tileSize: [512,512]
                // tileSize: 512
                // tileSize: [1024,1024]
            }),
            // url: 'http://localhost/geoserver/osm/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=application/x-protobuf;type=mapbox-vector&TRANSPARENT=true&STYLES&LAYERS=osm%3Aosm_places&SRS=EPSG%3A3857&WIDTH=768&HEIGHT=331&BBOX=150259.67508928478%2C4245752.038803326%2C619363.0509777835%2C4447319.8956304155'
            // url: 'https://c.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/1/0/1.vector.pbf?access_token=pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiRk1kMWZaSSJ9.E5BkluenyWQMsBLsuByrmg'
            url: 'http://ows.terrestris.de/vectortiles/osm-places/{z}/{x}/{y}.topojson'
            // url: 'http://localhost/ol3vectortiles/192.mvt'
        }),
        style: (function() {

            return function(feature, resolution) {
                var text = feature.get('name'),
                    type = feature.get('type'),
                    font = 'px Calibri,sans-serif';

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
                    zIndex: 999
                })];
                feature.setStyle(style);
                this.labelLayer.getSource().addFeature(feature);
            };
        })(),
        attributions: [attribution]
    });

    this.bboxLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
    });

    this.labelLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        format: new ol.format.MVT({
          defaultProjection: 'EPSG:3857'
        }),
        tileGrid: new ol.tilegrid.createXYZ({
            minZoom: 0,
            maxZoom: 19,
            tileSize: [512,512]
            // tileSize: 512
            // tileSize: [1024,1024]
        }),
      }),
      // style: new ol.style.Style({
      //   renderer: function(coords, state) {
      //     debugger;
      //     var text = state.feature.get('name');
      //     createLabel(textCache[text], text, coords);
      //   }
      // })
    });

    layers.push(landusage,waterareas,waterways,buildings,roads,places,osmwms,labelLayer);
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
        // renderer: 'canvas',
        layers: [new ol.layer.Group({
            layers: layers
        })],
        target: 'map',
        view: new ol.View({
            center: [784462.9171550141, 6570499.359385607],
            zoom: 18
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

    map.getView().on('change:resolution', function() {
      // debugger;
      // this.bboxLayer.getSource().clear();
      // this.labelLayer.getSource().clear();
      labelExtentArray= [];
        //updateStatistics(roads);
        //updateStatistics(buildings);
        //updateStatistics(landusage);
    }, this);

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
 *
 */
var labelFunction = function(feature, resolution) {
  // check if we can label this road
  var text = feature.get('name');
  // debugger;
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
                  return false;
              }

              longestSegment.set('z_order', feature.get('z_order'));

              var origLabelCenter = /*map.getPixelFromCoordinate(*/feature.getGeometry().getFlatMidpoint()/*)*/,
                  newLabelCenter =  /*map.getPixelFromCoordinate(*/longestSegment.getGeometry().getFlatMidpoint()/*)*/;
// debugger;
              // offset needs multiplication of 4 when using tilesize of 1024 instead of 256
              offsetX = -2*(origLabelCenter[0]-newLabelCenter[0]);
              offsetY = -2*(origLabelCenter[1]-newLabelCenter[1]);

          }
          var labelCenter;
          var coords;
          // at this stage we should have a linestring with just an start and endpoint
          if (longestSegment) {
            labelCenter = longestSegment.getGeometry().getFlatMidpoint();
            coords = longestSegment.get('geometry').getCoordinates();
          } else {
            labelCenter = feature.getGeometry().getFlatMidpoint();
            coords = feature.get('geometry').getCoordinates();
          }

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

          // degrees = -90;
          while (degrees > 90 || degrees < -90) {
              if (degrees > 90) {
                  degrees = 180 - degrees;
              } else if (degrees < -90) {
                  degrees = 180 + degrees;
              }
          }
          // final flip, needed when format MVT and not topojson
          degrees = degrees * -1;

          var radians = degrees * (Math.PI/180);

          // check for label collision
          // if (labelIsColliding(feature, resolution, labelCenter, radians, offsetX, offsetY)) {
          //   return textStyle;
          // }

          var textStroke = new ol.style.Stroke({
              color: '#fff',
              width: 3
          });
          var textFill = new ol.style.Fill({
              color: '#000'
          });
          var textStyle = new ol.style.Style({
              text: new ol.style.Text({
                  //font: 'normal 13px "Open Sans", "Arial Unicode MS"',
                  font: '13px Calibri,sans-serif',
                  text: text,
                  fill: textFill,
                  rotation: radians,
                  stroke: textStroke,
                  // textAlign: 'center',
                  offsetX: offsetX,
                  offsetY: offsetY
              }),
              zIndex: feature.get('z_order') + 999 || 999 // labels always on top :-)
          });

          // return textStyle;

          var factor = text.length * map.getView().getResolution() * 2;
          var x1 = labelCenter[0] + (factor * Math.sin(radians));
          var y1 = labelCenter[1] + (factor * Math.cos(radians));
          var x2 = x1 - factor * 2 * Math.sin(radians);
          var y2 = y1 - factor * 2 * Math.cos(radians)

          var labelLine = new ol.geom.LineString([map.getCoordinateFromPixel([x1,y1]),map.getCoordinateFromPixel([x2,y2])]);
          // rotate by 90 degrees
          labelLine.rotate(1.5708, labelCenter);
          var labelLineFeature = new ol.Feature({geometry:labelLine});
          // console.log(labelLineFeature.getGeometry().getCoordinates())
          // this.bboxLayer.getSource().addFeature(labelLineFeature);

          // var parser = new jsts.io.OL3Parser();
          // var jstsGeom = parser.read(labelLine);
          // create a buffer of 40 meters around each line
          // this.buffered = jstsGeom.buffer(10 * resolution);
          // labelLine = parser.write(buffered)

          // var labelLineExtent = labelLine.getExtent();
          var needToLabel = true;
          var collisionGeom;
          labelExtentArray.forEach(function(labeledExtent) {

            //  console.log("labeled extent: " + labeledExtent);

              if (labelLine.intersectsExtent(labeledExtent)) {

              // var intersection = this.buffered.intersection(labeledExtent);

              // if (intersection.getArea() > 0) {
                needToLabel = false;
                collisionGeom = labeledExtent;
                console.log("collider" + text)
                //debugger;
              }
          }, this);
          // debugger;


          // if (this.labelLayer) {
          //   this.labelLayer.getSource().addFeature(feature);
          // }

          // styleArray.push(textStyle);


          // for the first run
          if (needToLabel || labelExtentArray.length === 0) {
            // styleArray.push(textStyle);
            // feature.setStyle(textStyle);

// console.log(labelLine.getExtent())
            labelExtentArray.push(labelLine.getExtent());
            return textStyle;
          } else {
            return false;
            // return styleArray[0];
          }
        //
        //
        //   if (!needToLabel && collisionGeom) {
        //     debugger;
        //     //console.log("collision detected, skipping! " + text, feature.getGeometry(), labelLine)
        //     var polygon = labelLine;//ol.geom.Polygon.fromExtent(labelLine);
        //     var f = new ol.Feature({geometry:polygon});
        //     var polygon2 = parser.write(collisionGeom);//ol.geom.Polygon.fromExtent(collisionGeom);
        //     var f2 = new ol.Feature({geometry:polygon2});
        //     f.setStyle(new ol.style.Style({
        //         stroke: new ol.style.Stroke({
        //             color: 'red',
        //         }),
        //     }));
        //     f2.setStyle(new ol.style.Style({
        //         stroke: new ol.style.Stroke({
        //             color: 'blue',
        //         }),
        //     }));
        //     this.bboxLayer.getSource().addFeature(f);
        //     this.bboxLayer.getSource().addFeature(f2);
        //   }
        //
        }
        return false;
};
this.labelCollection = {
  features: [],
  resolutions: []
};
var labelIsColliding = function(feature, resolution, labelCenter, radians, offsetX, offsetY) {
  if (labelCollection.features.includes(feature)) {
    console.log("labelfeature already rendered");
    return true;
  }
  var textToRender = feature.get('name');
  labelCollection.features.forEach(function(feature) {
    var text = feature.get('name');
    var width = textToRender.length * resolution * 7;

    // debugger;
  });
  // if () {
  //
  // }
  labelCollection.features.push(feature);
  return false;
}

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

    if (this.labelLayer) {
      // console.log("adding");
      var textStyle;
      if (isHighWay) {
        var textStroke = new ol.style.Stroke({
            color: '#fff',
            width: 3
        });
        var textFill = new ol.style.Fill({
            color: '#000'
        });
        textStyle = new ol.style.Style({
            text: new ol.style.Text({
                font: '23px Calibri,sans-serif',
                text: text,
                fill: textFill,
                stroke: textStroke
            }),
            zIndex: feature.get('z_order') + 999 || 999 // labels always on top :-)
        });
      } else {
        textStyle = this.labelFunction(feature,resolution);
      }

      // var labelStyle = new ol.style.Style({
      //   renderer: function(coords, state) {
      //     debugger;
      //     var text = state.feature.get('name');
      //     createLabel(textCache[text], text, coords);
      //   }
      // });
      // var clone = feature.clone();
      // debugger;
      // textstyle.setStroke(new ol.style.Stroke({
      //     color: 'black',
      //     width: 3,
      //     lineCap: 'round',
      //     opacity: 1
      // }))
      // feature.setStyle(textstyle);
      // var coords = feature.getGeometry().getFlatCoordinates();
      // var coordArr = [];
      // for (var i = 0; i < coords.length; i++) {
      //   var coordpair = map.getCoordinateFromPixel([coords[i],coords[i+1]]);
      //   console.log(coordpair);
      //   if (!isNaN(coordpair[0]) && !isNaN(coordpair[1])) {
      //     coordArr.push(coordpair);
      //   }
      //
      // }
      // clone.setGeometry(new ol.geom.LineString(coordArr));
      // console.log(clone.getGeometry().getFlatCoordinates());
      // debugger;
      if (textStyle) {
          styleArray.push(textStyle);
      }
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
