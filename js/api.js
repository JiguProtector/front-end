const BASE_URL = 'https://windo-backend.onrender.com';

function fetchMapPoints(query = '') {
  return fetch(`${BASE_URL}/map/points${query}`)
    .then(res => res.json());
}

function fetchRoadDetail(linkId) {
  return fetch(`${BASE_URL}/roads/${linkId}`)
    .then(res => res.json());
}

function fetchEnergyImpact(linkId) {
  return fetch(`${BASE_URL}/energy/${linkId}/impact`)
    .then(res => res.json());
}

function fetchScaledEnergy(linkId, turbineCount) {
  return fetch(`${BASE_URL}/energy/${linkId}/impact/scale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ turbineCount })
  }).then(res => res.json());
}
