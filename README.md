# terrestris vectortiles
A simple library that makes use of free available world-wide terrestris vectortiles in MapBox MVT format from OpenStreetMap data.

The main method `getOSMLayer` creates an openlayers VectorTile Layer, which you
can use straight in your openlayers application.

![example](https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/terrestris-vectortiles.png "Example")

# demo
A simple demonstration application can be found here:

https://ows.terrestris.de/anwendungen.html#osm-vectortiles

# how to use
Include the `terrestrisTiles.js` file in your HTML file as a script source,
and also add the style files as resources:

```
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/terrestrisTiles.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-admin.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-bluebackground.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-buildings.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-roads.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-landusage.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-waterways.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-waterareas.js'></script>
<script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-countries.js'></script>
```

Then create the OSM-VectorTile layer by calling
```
terrestrisTiles.getOSMLayer();
```
which returns the layer you can then add to your openlayers map.

Optionally, you can set
```
terrestrisTiles.useDeclutter = false;
```
in order to disable decluttering of labels. This will improve performance, but will also make labels overlap.

# Complete example
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>terrestris OSM Vectortiles with OL4</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v4.6.4/css/ol.css" type="text/css">
    <script src='https://openlayers.org/en/v4.6.4/build/ol.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-admin.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-bluebackground.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-buildings.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-roads.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-landusage.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-waterways.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-waterareas.js'></script>
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/styles/style-countries.js'></script>
    <link rel="stylesheet" href="https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/app.css" type="text/css">
    <script src='https://raw.githubusercontent.com/weskamm/ol3vectortiles/master/terrestrisTiles.js'></script>
  </head>
  <body>
    <div id='map' />
    <script>
      var map = new ol.Map({
          layers: [],
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
      var layer = terrestrisTiles.getOSMLayer();
      map.addLayer(layer);
   </script>
  </body>
</html>
```
