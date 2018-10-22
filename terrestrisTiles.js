// terrestris OSM VectorTiles

// declare namespace
terrestrisTiles = {};

// should labels be decluttered?
// needs to be set before the layer gets created
terrestrisTiles.useDeclutter = true;

// resources like imagery for highway label signs
terrestrisTiles.babImg = document.createElement('img');
terrestrisTiles.babImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAbCAYAAADoOQYqAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4gIIDjocExrEmgAAAlVJREFUWMPtmM1OE1EUx393vtoy7dDWpCBgVQJNrGhiYuI7GN2ZuPAdfAV9Bt/BhWufwrAh0UBSQeRToUBhOlOZGWaOiylQjR9BWbRJ/5ubyZ2593fOvZOc/1EiMg68BW4BMSD8oxIRkiQdRQRNKZQCTSk0TfEfUoAOLAGPlIjMA/cvskKcCEEYE0YJQRQThDFBELPQ2Gehscf80h7buz5TYza3p8vcnS1zr3aFopPBMnUypoZlpaOhaxcNYF6JiAfYv3vD9SPafki7E+F1IjwvZO2rx4dPLZY+H7K42mK1cQDtADIGZHQwNVAKROAkgTCGIAZL5+pMmfp0ifrNEvUbRWanHAqOhZ0zcWyTwoiFY5t/OhlfiYgLFPzjE740O+wfHbPb+obnBuwcHPNx84jlrTYrGy4rmy40fTC0FM7QQVfps/rLxTqdjxOIfwqmnGVy0qFWHWV6okDtmsNUxSY3YlEpZ6mUckxUbOysAdBWichRY+3QefHqHdtuwHazw8aOT9j0081MDUwdNJUCnmZAuBwpIAGSnmCiGBKBUo7qeJ7qeJ6p0Qwvnz+gdr3oGiLCh+UWb16/h7E8aKRgxeyvN7ks2N71FKBr6a9m6YDZnRPWt9qsb7iw4/HkYY3Z6ijG2Yd5K81qP0mpNBBdpXzdhGk/3Ld+1umJnEEPmIbQQ+gh9BB6CD2EHkIPOHRPMdK36inqzqs8L4QoSZ2F9EnJJ5IagyhJ+bqJNZRSzM2UePrsTn86l8lz5zI3U0IpxWB6xEF14wPZ9xjrdpjqA9BhWgQefwcq3oy642N9sQAAAABJRU5ErkJggg==';


// the OSM-attribution
terrestrisTiles.attribution = new ol.control.Attribution({
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

// the style template used for linestrings
terrestrisTiles.lineStringStyleBelow = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'black',
    width: 2,
    lineCap: 'butt',
    lineDash: []
  }),
  zIndex: 0
});

// the style template used for linestrings
terrestrisTiles.lineStringStyleAbove = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'white',
    width: 1,
    lineCap: 'round',
    lineDash: []
  }),
  zIndex: 1
});

// the style template used for polygons
terrestrisTiles.polygonStyleFill = new ol.style.Fill({
  color: 'blue'
});
terrestrisTiles.polygonStyleStroke = new ol.style.Stroke({
  color: 'blue',
  width: 1,
  lineCap: 'round'
});
terrestrisTiles.polygonStyle = new ol.style.Style({
  fill: terrestrisTiles.polygonStyleFill,
  stroke: terrestrisTiles.polygonStyleStroke,
  zIndex: 0
});

// the style template used for highway icons
terrestrisTiles.iconStyle = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.9,
    imgSize: [45,27],
    img: terrestrisTiles.babImg,
    opacity: 0.8
  }),
  text: new ol.style.Text({
    padding: [50, 50, 50, 50],
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
  var population = feature.get('population');
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
  olText.getFill().setColor('#000');
  olText.getStroke().setColor('#fff');
  olText.getStroke().setWidth(5);
  olText.setPlacement('point');
  olText.setText(text);
  olText.setFont(fontString);
  var zIndex = population ? population : fontSize + 1000;
  terrestrisTiles.labelStyle.setZIndex(
    terrestrisTiles.useDeclutter ? -zIndex : zIndex);
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
  var isHighWay = (type.indexOf('motorway') > -1 || type.indexOf('trunk') > -1) &&
      props.class === 'highway' && props.ref.indexOf('A') === 0;
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
  var stroke;
  var strokeAbove;
  var fill;
  var color;
  if (geom === 'line') {
    stroke = terrestrisTiles.lineStringStyleBelow.getStroke();
    stroke.setColor(styleToUse[type].colors[0] || 'black');
    stroke.setWidth(styleToUse[type].widths[0] || 2);
    stroke.setLineCap(styleToUse[type].caps[0] || 'butt');
    stroke.setLineDash(styleToUse[type].dasharray ?
      styleToUse[type].dasharray.split(' ') : []);
    terrestrisTiles.lineStringStyleBelow.setZIndex(feature.get('z_order') || 0);
    if (styleToUse[type].opacity) {
      setOpacity(stroke, styleToUse[type].opacity);
    }
    style.push(terrestrisTiles.lineStringStyleBelow);

    // check if we need a "outline" for this road
    if (styleToUse[type].widths.length > 1) {
      strokeAbove = terrestrisTiles.lineStringStyleAbove.getStroke();
      strokeAbove.setColor(styleToUse[type].colors[1] || 'white');
      strokeAbove.setWidth(styleToUse[type].widths[1] || 1);
      strokeAbove.setLineCap(styleToUse[type].caps[1] || 'round');
      strokeAbove.setLineDash(styleToUse[type].dasharray ?
        styleToUse[type].dasharray.split(' ') : []);
      terrestrisTiles.lineStringStyleAbove.setZIndex(feature.get('z_order') + 1 || 1);
      if (styleToUse[type].opacity) {
        setOpacity(strokeAbove, styleToUse[type].opacity);
      }
      style.push(terrestrisTiles.lineStringStyleAbove);
    }
  } else if (geom === 'polygon') {
    var hasFill = styleToUse[type].fillColor || styleToUse[type].fillOpacity;
    var hasStroke = styleToUse[type].strokeColor || styleToUse[type].strokeWidth;
    if (hasFill) {
      fill = terrestrisTiles.polygonStyle.getFill();
      if (!fill) {
        fill = terrestrisTiles.polygonStyleFill;
        terrestrisTiles.polygonStyle.setFill(fill);
      }
      fill.setColor(styleToUse[type].fillColor || 'blue');
    } else {
      terrestrisTiles.polygonStyle.setFill(undefined);
    }
    if (hasStroke) {
      stroke = terrestrisTiles.polygonStyle.getStroke();
      if (!stroke) {
        stroke = terrestrisTiles.polygonStyleStroke;
        terrestrisTiles.polygonStyle.setStroke(stroke);
      }
      stroke.setColor(styleToUse[type].strokeColor || 'blue');
      stroke.setWidth(styleToUse[type].strokeWidth || 1);
      stroke.setLineCap(styleToUse[type].lineCap || 'round');
    } else {
      terrestrisTiles.polygonStyle.setStroke(undefined);
    }
    terrestrisTiles.polygonStyle.setZIndex(styleToUse[type].zIndex || feature.get('z_order') || 0);

    // set the alpha values
    if (fill && styleToUse[type].fillOpacity) {
      setOpacity(fill, styleToUse[type].fillOpacity);
    }
    if (stroke && styleToUse[type].strokeOpacity) {
      setOpacity(stroke, styleToUse[type].strokeOpacity);
    }
    style.push(terrestrisTiles.polygonStyle);
  }

  if (styleToUse[type].useLabels !== false) {
    if (isHighWay && resolution < 300) {
      // try to extract coordinates from an ol.render.feature
      var coords = feature.getGeometry().getFlatCoordinates();
      if (coords && coords.length > 1) {
        var point = new ol.geom.Point([coords[0], coords[1]]);
        terrestrisTiles.iconStyle.setGeometry(point);
        terrestrisTiles.iconStyle.getText().setText(props.ref || props.name);
        style.push(terrestrisTiles.iconStyle);
      }
    } else if (resolution < 300) {
      // care about labels for streets, buildings etc.
      var olText = terrestrisTiles.labelStyle.getText();
      fill = olText.getFill();
      stroke = olText.getStroke();
      fill.setColor(styleToUse[type].textFillColor || 'black');
      stroke.setColor(styleToUse[type].textStrokeColor || 'white');
      stroke.setWidth(styleToUse[type].textStrokeWidth || 5);
      olText.setPlacement(styleToUse[type].textPlacement || 'line');
      olText.setText(text);
      olText.setFont(styleToUse[type].font || '13px sans-serif');
      var zIndex = feature.get('z_order') || 1;
      terrestrisTiles.labelStyle.setZIndex(terrestrisTiles.useDeclutter ?
        -zIndex : zIndex);
      style.push(terrestrisTiles.labelStyle);
    }
  }
  return style;
};

/**
 * Sets the opacity on a style
 * @param  {ol.style.Fill or ol.style.Stroke} style The style to set the opacity on
 * @param  {Number} opacity The opacity value to set
 */
setOpacity = function(style, opacity) {
  var color = ol.color.asArray(style.getColor());
  color[3] = opacity;
  style.setColor(color);
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
      url: 'https://ows.terrestris.de/osm-vectortiles/' + 'osm:osm_world_vector' +
        '@mapbox-vector-tiles@pbf/{z}/{x}/{-y}.pbf',
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
        case 'osm_roads_gen1':
          style = terrestrisTiles.buildStyle(feature, resolution, style_roads, 'line');
          break;
        case 'osm_buildings':
          style = terrestrisTiles.buildStyle(feature, resolution, style_buildings, 'polygon');
          break;
        case 'bluebackground_no_limit':
          style = terrestrisTiles.buildStyle(feature, resolution, style_bluebackground, 'polygon');
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
