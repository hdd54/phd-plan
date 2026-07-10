const assert = require('node:assert');
const fs = require('node:fs');
const test = require('node:test');

test('globe renderer exposes the required interaction contract', function () {
  const source = fs.readFileSync('js/feature-map-globe.js', 'utf8');
  [
    'MapGlobeRenderer',
    'setRegions',
    'setSelected',
    'renderTheme',
    'zoomBy',
    'resetView',
    'resize',
    'destroy',
    'THREE.Raycaster',
    'pickCanvas'
  ].forEach(function (token) {
    assert.match(source, new RegExp(token));
  });
  new Function(source);
});
