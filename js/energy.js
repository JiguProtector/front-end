function loadEnergy(linkId) {
  fetchEnergyImpact(linkId).then(renderEnergy);
}

function renderEnergy(data) {
  document.getElementById('detail-content').innerHTML += `
    <hr/>
    <b>연간 수익:</b> ${Math.round(data.yearlyRevenueWon).toLocaleString()} 원<br/>
    <b>연간 CO₂ 절감:</b> ${data.yearlyCo2SavedKg.toFixed(1)} kg
  `;
}
