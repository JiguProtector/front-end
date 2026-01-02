const filterDiv = document.getElementById('filter');

// S, A, B, C, D 체크박스 생성
['S','A','B','C','D'].forEach(g => {
  filterDiv.innerHTML += `
    <label>
      <input type="checkbox" value="${g}" checked /> 
      <span style="font-weight:bold;">${g} 등급</span>
    </label><br/>
  `;
});

// 체크박스 변경 시 API 호출 후 마커 다시 그리기
filterDiv.addEventListener('change', () => {
  const grades = [...filterDiv.querySelectorAll('input:checked')]
    .map(i => i.value);

  // 선택된 등급이 없으면 빈 쿼리, 있으면 ?grades=S,A 형식
  const query = grades.length ? `?grades=${grades.join(',')}` : '';
  
  // api.js의 함수 호출 -> map.js의 함수로 렌더링
  fetchMapPoints(query).then(renderMarkers);
});