// 1. 지도 초기화 (줌 컨트롤 위치 변경)
const map = L.map('map', { zoomControl: false }).setView([37.5665, 126.9780], 11);
L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const GRADE_COLOR = {
  S: '#ef4444', A: '#f97316', B: '#eab308', C: '#22c55e', D: '#94a3b8'
};

let markers = [];
let allMapPoints = [];

// 토스트 메시지 함수
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 초기 데이터 로드
fetchMapPoints().then(data => {
  console.log("📍 [초기 데이터 수신]", data);
  if (Array.isArray(data)) allMapPoints = data;
  else if (data.data) allMapPoints = data.data;
  else if (data.result) allMapPoints = data.result;
  else allMapPoints = [];
  
  renderMarkers(allMapPoints);
  // 초기 로딩 토스트는 너무 잦을 수 있으므로 주석 처리하거나 필요 시 사용
  // showToast(`데이터 ${allMapPoints.length}건 로드 완료`);
}).catch(err => console.error(err));

function renderMarkers(points) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  if (!points || points.length === 0) return;

  points.forEach(p => {
    const lat = p.lat || p.latitude;
    const lon = p.lon || p.longitude;
    const linkId = p.linkId || p.id; 

    if (!lat || !lon) return;

    const color = GRADE_COLOR[p.grade] || '#94a3b8';

    const marker = L.circleMarker([lat, lon], {
      radius: 6,
      color: 'white',
      weight: 1,
      fillColor: color,
      fillOpacity: 0.85
    }).addTo(map).on('click', () => {
      if(linkId) {
        loadRoadDetail(linkId);
        map.flyTo([lat, lon], 14, { duration: 1.5 });
      }
    });

    markers.push(marker);
  });
}

// Top 10 로직 (수정됨: 점수 정수화)
function loadTop10() {
  fetchTop10Roads().then(top10Data => {
    const combinedData = top10Data.map(topItem => {
      const original = allMapPoints.find(p => p.linkId === topItem.linkId);
      if (original) {
        return { 
          ...topItem, 
          lat: original.lat || original.latitude, 
          lon: original.lon || original.longitude,
          grade: original.grade 
        };
      } else return topItem;
    });

    const validData = combinedData.filter(d => d.lat && d.lon);
    
    if (validData.length > 0) {
      renderMarkers(validData);
      
      // 1위 위치로 이동
      map.flyTo([validData[0].lat, validData[0].lon], 13, { duration: 2 });
      
      // 👇 [수정됨] 점수를 반올림하여 정수로 표시
      const topScore = Math.round(validData[0].aiScore);
      showToast(`🏆 Top 10 도로를 조회했습니다! (1위 점수: ${topScore}점)`);
    } else {
      showToast("Top 10 위치 정보를 찾을 수 없습니다.");
    }
  });
}