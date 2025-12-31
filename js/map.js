const map = L.map('map').setView([37.5665, 126.9780], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

const GRADE_COLOR = {
  S: '#ef4444',
  A: '#f97316',
  B: '#eab308',
  C: '#22c55e',
  D: '#94a3b8',
};

let markers = [];

function renderMarkers(points) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  points.forEach(p => {
    const marker = L.circleMarker([p.lat, p.lon], {
      radius: 6,
      color: GRADE_COLOR[p.grade],
      fillOpacity: 0.85
    })
    .addTo(map)
    .on('click', () => loadRoadDetail(p.linkId));

    markers.push(marker);
  });
}
