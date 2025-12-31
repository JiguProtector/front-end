let currentLinkId = null;

function loadRoadDetail(linkId) {
  currentLinkId = linkId;
  fetchRoadDetail(linkId).then(data => {
    document.getElementById('detail-content').innerHTML = `
      <b>${data.startName} → ${data.endName}</b><br/>
      지역: ${data.region}<br/>
      AI 점수: ${data.aiScore}<br/>
      등급: ${data.grade}<br/>
      평균 발전량: ${data.avgPower} W<br/>
      설명: ${data.aiExplanation}
    `;
    loadEnergy(linkId);
  });
}
