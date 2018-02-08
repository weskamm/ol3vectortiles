// terrestris OSM VectorTiles

// declare namespace
terrestrisTiles = {};

// should labels be decluttered?
// needs to be set before the layer gets created
terrestrisTiles.useDeclutter = true;

// the OSM-attribution
terrestrisTiles.attribution = new ol.Attribution({
  html: '© terrestris GmbH & Co. KG<br>' +
  'Data © OpenStreetMap <a href="http://www.openstreetmap.org/copyright/en" ' +
  'target="_blank">contributors</a>'
});

// the style template used for labels
terrestrisTiles.labelStyle = new ol.style.Style({
  text: new ol.style.Text({
    font: '13px sans-serif',
    fill: new ol.style.Fill({
      color: '#000'
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 3
    }),
    placement: 'line',
    maxAngle: 0.4,
    padding: [10, 10, 10, 10]
  })
});

/**
 * Creates a style for labels of places like countries or cities
 *
 * @param  {ol.Feature} feature The feature to style
 * @param  {Number} resolution The current maps resolution
 * @return {ol.style.Style[]} The style to use for the given feature
 */
terrestrisTiles.buildLabelStyle = function(feature, resolution) {
  var text = feature.get('name');
  var type = feature.get('type');
  var fontString = 'px sans-serif';
  var fontSize;
  if (type === 'country') {
    fontSize = 17;
  } else if (type === 'city') {
    fontSize = 16;
  } else if (type === 'town' && resolution < 600) {
    fontSize = 15;
  } else if (type === 'village' && resolution < 75) {
    fontSize = 14;
  } else {
    return null;
  }
  fontString = fontSize + fontString;
  var olText = terrestrisTiles.labelStyle.getText();
  olText.setFill(new ol.style.Fill({
    color: '#000',
    width: 3
  }));
  olText.setStroke(new ol.style.Stroke({
    color: '#fff',
    width: 5
  }));
  olText.setPlacement('point');
  olText.setText(text);
  olText.setFont(fontString);
  terrestrisTiles.labelStyle.setZIndex(
    terrestrisTiles.useDeclutter ? -1 : fontSize + 1000);
  return [terrestrisTiles.labelStyle];
};

/**
 * [description]
 * @param  {ol.Feature} feature The feature to style
 * @param  {Number} resolution The current maps resolution
 * @param  {Object[]} styleArray The array of style objects to use
 * @param  {String} geom The geometry type, e.g. 'polygon'
 * @return {ol.style.Style[]} The style to use for the given feature
 */
terrestrisTiles.buildStyle = function(feature, resolution, styleArray, geom) {
  if (!styleArray) {
    return null;
  }

  var props = feature.getProperties();
  var type = props.type || '';
  var text = props.name || props.ref || null;
  var isHighWay = (props.type === 'motorway' || props.type === 'trunk') &&
      props.class === 'highway' && props.ref.indexOf('A') > -1;
  var styleToUse;

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
        lineDash: styleToUse[type].dasharray ?
          styleToUse[type].dasharray.split(' ') : []
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
          color: styleToUse[type].fillColor || 'blue'
        }) : undefined,
      stroke: (styleToUse[type].strokeColor || styleToUse[type].strokeWidth) ?
        new ol.style.Stroke({
          color: styleToUse[type].strokeColor || 'blue',
          width: styleToUse[type].strokeWidth || 1,
          lineCap: styleToUse[type].lineCap || 'round'
        }) : undefined,
      zIndex: styleToUse[type].zIndex || (feature.get('z_order') || 0)
    });
    // set the alpha values
    var color;
    if (polyStyle.getFill() && styleToUse[type].fillOpacity) {
      color = ol.color.asArray(polyStyle.getFill().getColor());
      color[3] = styleToUse[type].fillOpacity;
      polyStyle.getFill().setColor(color);
    }
    if (polyStyle.getStroke() && styleToUse[type].strokeOpacity) {
      color = ol.color.asArray(polyStyle.getStroke().getColor());
      color[3] = styleToUse[type].strokeOpacity;
      polyStyle.getStroke().setColor(color);
    }
    style.push(polyStyle);
  }

  if (styleToUse[type].useLabels !== false) {
    if (isHighWay && resolution < 300) {
      // try to extract coordinates from an ol.render.feature
      if (feature.getGeometry().b && feature.getGeometry().b.length > 1) {
        var coords = feature.getGeometry().b;
        var point = new ol.geom.Point([coords[0], coords[1]]);
        terrestrisTiles.labelStyle.getText().setPlacement('point');
        var iconStyle = new ol.style.Style({
          geometry: point,
          image: new ol.style.Icon({
            scale: 0.9,
            imgSize: [45,27],
            img: babImg,
            opacity: 0.8
          }),
          text: new ol.style.Text({
            padding: [50, 50, 50, 50],
            text: text,
            font: '12px sans-serif',
            fill: new ol.style.Fill({
              color: '#fff'
            }),
            stroke: new ol.style.Stroke({
              color: '#fff',
              width: 0.8
            })
          }),
          zIndex: 0
        });
        style.push(iconStyle);
      }
    } else if (resolution < 300) {
      // care about labels for streets, buildings etc.
      var olText = terrestrisTiles.labelStyle.getText();
      olText.setFill(new ol.style.Fill({
        color: styleToUse[type].textFillColor || 'black',
        width: styleToUse[type].textFillWidth || 3
      }));
      olText.setStroke(new ol.style.Stroke({
        color: styleToUse[type].textStrokeColor || 'white',
        width: styleToUse[type].textStrokeWidth || 5
      }));
      olText.setPlacement(styleToUse[type].textPlacement || 'line');
      olText.setText(text);
      olText.setFont(styleToUse[type].font || '13px sans-serif');
      terrestrisTiles.labelStyle.setZIndex(100);
      style.push(terrestrisTiles.labelStyle);
    }
  }
  return style;
};

/**
 * Creates and returns the terrestris OSM VectorTile layer
 *
 * @return {ol.layer.VectorTile} The terrestris OSM VectorTile layer
 */
terrestrisTiles.getOSMLayer = function() {
  var osmLayer = new ol.layer.VectorTile({
    name: 'terrestris-vectortiles',
    declutter: terrestrisTiles.useDeclutter,
    source: new ol.source.VectorTile({
      format: new ol.format.MVT(),
      tileGrid: ol.tilegrid.createXYZ({
        tileSize: [512,512]
      }),
      url: 'https://ows.terrestris.de/osm-vectortiles/' + 'osm:osm_world' +
        '@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
      attributions: [terrestrisTiles.attribution]
    }),
    style: function(feature, resolution) {
      var l = feature.get('layer');
      var style;
      switch (l) {
        case 'osm_roads':
          style = terrestrisTiles.buildStyle(feature, resolution, style_roads, 'line');
          break;
        case 'osm_roads_gen0':
          style = terrestrisTiles.buildStyle(feature, resolution, style_roads, 'line');
          break;
        case 'osm_buildings':
          style = terrestrisTiles.buildStyle(feature, resolution, style_buildings, 'polygon');
          break;
        case 'bluebackground':
          style = terrestrisTiles.buildStyle(feature, resolution, style_bluebackground, 'polygon');
          break;
        case 'osm_admin':
          style = terrestrisTiles.buildStyle(feature, resolution, style_admin, 'polygon');
          break;
        case 'osm_places':
          style = terrestrisTiles.buildLabelStyle(feature, resolution);
          break;
        case 'osm_landusages':
          style = terrestrisTiles.buildStyle(feature, resolution, style_landusage, 'polygon');
          break;
        case 'osm_landusages_gen0':
          style = terrestrisTiles.buildStyle(feature, resolution, style_landusage, 'polygon');
          break;
        case 'osm_waterways':
          style = terrestrisTiles.buildStyle(feature, resolution, style_waterways, 'line');
          break;
        case 'osm_waterareas':
          style = terrestrisTiles.buildStyle(feature, resolution, style_waterareas, 'polygon');
          break;
        case 'osm_waterareas_gen0':
          style = terrestrisTiles.buildStyle(feature, resolution, style_waterareas, 'polygon');
          break;
        case 'world_boundaries_labels':
          style = terrestrisTiles.buildStyle(feature, resolution, style_countries, 'polygon');
          break;
        default:
          break;
      }
      return style;
    }
  });
  return osmLayer;
};

// resources like imagery for highway label signs
var babImg = document.createElement('img');
babImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAbCAYAAADoOQYqAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gIIDjocExrEmgAAAlVJREFUWMPtmM1OE1EUx393vtoy7dDWpCBgVQJNrGhiYuI7GN2ZuPAdfAV9Bt/BhWufwrAh0UBSQeRToUBhOlOZGWaOiylQjR9BWbRJ/5ubyZ2593fOvZOc/1EiMg68BW4BMSD8oxIRkiQdRQRNKZQCTSk0TfEfUoAOLAGPlIjMA/cvskKcCEEYE0YJQRQThDFBELPQ2Gehscf80h7buz5TYza3p8vcnS1zr3aFopPBMnUypoZlpaOhaxcNYF6JiAfYv3vD9SPafki7E+F1IjwvZO2rx4dPLZY+H7K42mK1cQDtADIGZHQwNVAKROAkgTCGIAZL5+pMmfp0ifrNEvUbRWanHAqOhZ0zcWyTwoiFY5t/OhlfiYgLFPzjE740O+wfHbPb+obnBuwcHPNx84jlrTYrGy4rmy40fTC0FM7QQVfps/rLxTqdjxOIfwqmnGVy0qFWHWV6okDtmsNUxSY3YlEpZ6mUckxUbOysAdBWichRY+3QefHqHdtuwHazw8aOT9j0081MDUwdNJUCnmZAuBwpIAGSnmCiGBKBUo7qeJ7qeJ6p0Qwvnz+gdr3oGiLCh+UWb16/h7E8aKRgxeyvN7ks2N71FKBr6a9m6YDZnRPWt9qsb7iw4/HkYY3Z6ijG2Yd5K81qP0mpNBBdpXzdhGk/3Ld+1umJnEEPmIbQQ+gh9BB6CD2EHkIPOHRPMdK36inqzqs8L4QoSZ2F9EnJJ5IagyhJ+bqJNZRSzM2UePrsTn86l8lz5zI3U0IpxWB6xEF14wPZ9xjrdpjqA9BhWgQefwcq3oy642N9sQAAAABJRU5ErkJggg==';
