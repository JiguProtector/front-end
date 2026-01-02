// 상태 관리 변수
let energyLinkId = null;
const seasonSelect = document.getElementById('season-select');
const turbineRange = document.getElementById('turbine-range');
const turbineVal = document.getElementById('turbine-val');
const energyUi = document.getElementById('energy-ui');
const resultDiv = document.getElementById('energy-result');

// 패널 초기화 함수 (detail.js에서 호출됨)
function initEnergyPanel(linkId) {
  energyLinkId = linkId;
  energyUi.style.display = 'block'; // 패널 보이기
  
  // 입력값 초기화
  seasonSelect.value = "";
  turbineRange.value = 1;
  turbineVal.innerText = "1";

  // 기본 데이터 로드
  loadEnergyData();
}

// 이벤트 리스너 등록
seasonSelect.addEventListener('change', loadEnergyData);

// 슬라이더 조작 중: 숫자만 실시간 업데이트 (API 호출 X)
turbineRange.addEventListener('input', (e) => {
  turbineVal.innerText = e.target.value; 
});

// 슬라이더 조작 완료: API 호출하여 계산 시작
turbineRange.addEventListener('change', loadEnergyData);


// 데이터 로드 및 로딩 화면 표시
function loadEnergyData() {
  if (!energyLinkId) return;

  const season = seasonSelect.value;
  const count = parseInt(turbineRange.value);

  // 👇 [로딩 화면] 스피너를 문구 위로 배치 (수직 정렬)
  resultDiv.innerHTML = `
    <div class="loading-container" style="padding: 40px 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      
      <div class="spinner" style="width: 30px; height: 30px; border-width: 3px; margin-bottom: 15px;"></div>
      
      <div style="font-weight: 700; color: #0f172a; font-size: 1rem; text-align: center;">
        예상 발전 수익을 산출하고 있습니다...
      </div>

      <span style="font-size:0.85rem; color:#94a3b8; margin-top: 8px;">
        (AI 시뮬레이션 모델 가동 중)
      </span>
      
    </div>
  `;

  let promise;
  
  // 조건에 따라 다른 API 호출
  if (count > 1) {
    // 터빈 수 조절 시 (Scale API)
    promise = fetchScaledEnergy(energyLinkId, count);
  } else if (season) {
    // 계절 선택 시 (Seasonal API)
    promise = fetchSeasonalEnergy(energyLinkId, season);
  } else {
    // 기본 (1기, 연간 평균)
    promise = fetchEnergyImpact(energyLinkId);
  }

  promise.then(renderEnergyResult);
}


// 결과 렌더링 함수
function renderEnergyResult(data) {
  // 숫자 포맷팅 헬퍼 (콤마 찍기)
  const fmt = (num) => Math.round(num).toLocaleString();
  const fmtF = (num) => num.toFixed(1);

  // 결과 HTML 생성
  resultDiv.innerHTML = `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px dashed #e2e8f0; animation: fadeUp 0.3s ease-out;">
      
      <div style="margin-bottom: 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
           <span style="font-size:0.9rem; color:#64748b; font-weight:600;">💰 연간 예상 수익</span>
           <span style="font-size:1.2rem; font-weight:800; color:#2563eb;">${fmt(data.yearlyRevenueWon)} 원</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
           <span style="font-size:0.85rem; color:#94a3b8;">5년 누적 수익</span>
           <span style="font-size:0.95rem; font-weight:600; color:#475569;">${fmt(data.fiveYearRevenueWon)} 원</span>
        </div>
      </div>

      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
           <span style="font-size:0.9rem; color:#166534; font-weight:700;">🌱 CO₂ 절감량</span>
           <span style="font-size:1.1rem; font-weight:700; color:#15803d;">${fmtF(data.yearlyCo2SavedKg)} kg</span>
        </div>
        <div style="text-align:right; font-size:0.8rem; color:#166534;">
           (소나무 약 ${Math.round(data.yearlyCo2SavedKg / 6.6)}그루 효과)
        </div>
      </div>

    </div>
  `;
}