const BASE_URL = 'https://windo-backend.onrender.com';

async function fetchWithLog(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`서버 오류 발생! 상태 코드: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`🚨 API 요청 실패 (${url}):`, error);
    throw error; // 에러를 상위 함수로 넘김
  }
}

function fetchMapPoints(query = '') {
  return fetchWithLog(`${BASE_URL}/map/points${query}`);
}

function fetchRoadDetail(linkId) {
  return fetchWithLog(`${BASE_URL}/roads/${linkId}`);
}

function fetchEnergyImpact(linkId) {
  return fetchWithLog(`${BASE_URL}/energy/${linkId}/impact`);
}

function fetchSeasonalEnergy(linkId, season) {
  return fetchWithLog(`${BASE_URL}/energy/${linkId}/impact/season?season=${season}`);
}

function fetchScaledEnergy(linkId, turbineCount) {
  return fetchWithLog(`${BASE_URL}/energy/${linkId}/impact/scale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ turbineCount })
  });
}

function fetchTop10Roads() {
  return fetchWithLog(`${BASE_URL}/roads/top10`);
}