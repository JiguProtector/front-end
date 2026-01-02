let currentLinkId = null;

function loadRoadDetail(linkId) {
  currentLinkId = linkId;
  
  fetchRoadDetail(linkId).then(data => {
    // 1. 등급별 색상
    const gradeColors = { S:'#ef4444', A:'#f97316', B:'#eab308', C:'#22c55e', D:'#94a3b8' };
    const color = gradeColors[data.grade] || '#94a3b8';

    // 2. 숫자 포맷팅
    const formattedScore = Math.round(data.aiScore); 
    const formattedPower = Math.round(data.avgPower).toLocaleString(); 
    const formattedDist = Math.round(data.distanceM).toLocaleString(); 
    
    // 3. HTML 생성 (여백 최소화 - Compact Mode)
    const contentDiv = document.getElementById('detail-content');
    contentDiv.innerHTML = `
      <div style="margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;">
        <span class="grade-badge" style="background-color: ${color}; padding: 6px 14px; font-size: 1rem;">
          ${data.grade} 등급
        </span>
        <div style="text-align: right;">
          <span style="font-size:1.4rem; font-weight:800; color:#0f172a; line-height:1;">
            ${formattedScore} <span style="font-size:0.9rem; color:#cbd5e1; font-weight:400;">/ 100</span>
          </span>
        </div>
      </div>

      <h2 style="margin: 0 0 5px 0; font-size: 1.35rem; color: #0f172a; line-height: 1.2; letter-spacing: -0.5px;">
        ${data.startName}
      </h2>
      <p style="margin:0 0 15px 0; color:#64748b; font-size:0.9rem;">
        <span style="color:#cbd5e1;">│</span> ${data.endName} 방향 <br/>
        <span style="color:#cbd5e1;">│</span> 📍 ${data.region} (${data.roadType})
      </p>
      
      <div class="info-card" style="background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 4px; padding: 12px; margin-bottom: 15px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: #2563eb; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
           💡 AI 분석 리포트
        </div>
        <p style="margin:0; line-height:1.5; font-size:0.9rem; color:#334155;">
          ${data.aiExplanation}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
        <div style="background: #f8fafc; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0;">
           <div style="font-size:0.75rem; color:#64748b; margin-bottom:2px;">⚡ 평균 발전량</div>
           <div style="font-size:1rem; font-weight:700; color:#0f172a;">${formattedPower} W</div>
        </div>
        <div style="background: #f8fafc; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0;">
           <div style="font-size:0.75rem; color:#64748b; margin-bottom:2px;">📏 도로 길이</div>
           <div style="font-size:1rem; font-weight:700; color:#0f172a;">${formattedDist} m</div>
        </div>
      </div>
    `;

    // 에너지 패널 초기화
    if(typeof initEnergyPanel === 'function') {
      initEnergyPanel(linkId);
    }
  });
}