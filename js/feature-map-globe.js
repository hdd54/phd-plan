(function (global) {
  'use strict';

  var MAP_WIDTH = 1024;
  var MAP_HEIGHT = 512;
  var MIN_DISTANCE = 2.35;
  var MAX_DISTANCE = 5.4;

  function create(options) {
    if (!global.THREE || !global.d3 || !options || !options.container) return null;

    var host = options.container;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    var textureCanvas = document.createElement('canvas');
    var pickCanvas = document.createElement('canvas');
    var textureContext = textureCanvas.getContext('2d');
    var pickContext = pickCanvas.getContext('2d', { willReadFrequently: true });
    var texture;
    var globe;
    var glow;
    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2();
    var regions = [];
    var regionByPick = [];
    var selected = null;
    var frame = 0;
    var destroyed = false;
    var interacted = false;
    var dragging = false;
    var moved = false;
    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastY = 0;
    var resizeObserver;

    textureCanvas.width = pickCanvas.width = MAP_WIDTH;
    textureCanvas.height = pickCanvas.height = MAP_HEIGHT;
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'map-globe-canvas';
    host.replaceChildren(renderer.domElement);

    texture = new THREE.CanvasTexture(textureCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 72, 48),
      new THREE.MeshBasicMaterial({ map: texture })
    );
    globe.rotation.y = -0.45;
    scene.add(globe);

    glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.545, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x91d7d0, transparent: true, opacity: 0.08, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    scene.add(glow);
    camera.position.z = 3.65;

    function cssColor(name, fallback) {
      var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    }

    function theme() {
      return {
        ocean: cssColor('--bg3', '#111615'),
        land: cssColor('--bg2', '#1d2925'),
        line: cssColor('--line', '#64736c'),
        fg: cssColor('--fg', '#e6e0d5'),
        accent: cssColor('--accent', '#d4a574')
      };
    }

    function pickColor(index) {
      var value = index + 1;
      return 'rgb(' + (value & 255) + ',' + ((value >> 8) & 255) + ',' + ((value >> 16) & 255) + ')';
    }

    function drawMap() {
      var colors = theme();
      var projection = d3.geoEquirectangular().scale(MAP_WIDTH / (2 * Math.PI)).translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
      var displayPath = d3.geoPath(projection, textureContext);
      var pickPath = d3.geoPath(projection, pickContext);

      textureContext.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      textureContext.fillStyle = colors.ocean;
      textureContext.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      pickContext.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      regionByPick = [];

      regions.forEach(function (region, index) {
        if (!region.feature || !region.feature.geometry) return;
        var isSelected = selected && selected.id === region.id;
        textureContext.beginPath();
        displayPath(region.feature);
        textureContext.fillStyle = isSelected ? colors.accent : colors.land;
        textureContext.globalAlpha = isSelected ? 0.96 : 0.82;
        textureContext.fill();
        textureContext.globalAlpha = 1;
        textureContext.strokeStyle = isSelected ? colors.fg : colors.line;
        textureContext.lineWidth = isSelected ? 1.75 : 0.65;
        textureContext.stroke();

        pickContext.beginPath();
        pickPath(region.feature);
        pickContext.fillStyle = pickColor(index);
        pickContext.fill();
        regionByPick[index] = region;
      });

      texture.needsUpdate = true;
      glow.material.color.set(colors.accent);
    }

    function regionAtEvent(event) {
      var rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      var hit = raycaster.intersectObject(globe, false)[0];
      if (!hit || !hit.uv) return null;
      var x = Math.max(0, Math.min(MAP_WIDTH - 1, Math.floor(hit.uv.x * MAP_WIDTH)));
      var y = Math.max(0, Math.min(MAP_HEIGHT - 1, Math.floor((1 - hit.uv.y) * MAP_HEIGHT)));
      var color = pickContext.getImageData(x, y, 1, 1).data;
      var index = color[0] + (color[1] << 8) + (color[2] << 16) - 1;
      return regionByPick[index] || null;
    }

    function render() {
      if (!destroyed) renderer.render(scene, camera);
    }

    function animate() {
      if (destroyed) return;
      if (!interacted && !dragging) globe.rotation.y += 0.0007;
      render();
      frame = global.requestAnimationFrame(animate);
    }

    function onPointerDown(event) {
      interacted = true;
      dragging = true;
      moved = false;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (dragging) {
        var dx = event.clientX - lastX;
        var dy = event.clientY - lastY;
        if (Math.abs(event.clientX - startX) + Math.abs(event.clientY - startY) > 4) moved = true;
        globe.rotation.y += dx * 0.008;
        globe.rotation.x = Math.max(-1.15, Math.min(1.15, globe.rotation.x + dy * 0.006));
        lastX = event.clientX;
        lastY = event.clientY;
        render();
        return;
      }
      var region = regionAtEvent(event);
      if (region) options.onHover && options.onHover(region, event.clientX, event.clientY);
      else options.onLeave && options.onLeave();
    }

    function onPointerUp(event) {
      if (!dragging) return;
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      if (!moved) {
        var region = regionAtEvent(event);
        if (region && options.onSelect) options.onSelect(region);
      }
    }

    function onPointerLeave() {
      if (!dragging && options.onLeave) options.onLeave();
    }

    function onWheel(event) {
      event.preventDefault();
      api.zoomBy(event.deltaY < 0 ? 0.86 : 1.16);
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    function resize() {
      var rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
      render();
    }

    resizeObserver = global.ResizeObserver ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(host);
    else global.addEventListener('resize', resize);

    var api = {
      setRegions: function (nextRegions) {
        regions = (nextRegions || []).filter(function (region) { return region && region.feature && region.feature.geometry; });
        drawMap();
        resize();
      },
      setSelected: function (region) {
        selected = region || null;
        drawMap();
        render();
      },
      renderTheme: function () {
        drawMap();
        render();
      },
      zoomBy: function (factor) {
        camera.position.z = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, camera.position.z * factor));
        render();
      },
      resetView: function () {
        camera.position.z = 3.65;
        globe.rotation.set(0, -0.45, 0);
        render();
      },
      resize: resize,
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        global.cancelAnimationFrame(frame);
        if (resizeObserver) resizeObserver.disconnect();
        else global.removeEventListener('resize', resize);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('pointercancel', onPointerUp);
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
        renderer.domElement.removeEventListener('wheel', onWheel);
        globe.geometry.dispose();
        globe.material.dispose();
        glow.geometry.dispose();
        glow.material.dispose();
        texture.dispose();
        renderer.dispose();
        host.replaceChildren();
      }
    };

    resize();
    drawMap();
    animate();
    return api;
  }

  global.MapGlobeRenderer = Object.freeze({ create: create });
})(window);
