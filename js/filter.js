const filterDiv = document.getElementById('filter');
['S','A','B','C','D'].forEach(g => {
  filterDiv.innerHTML += `
    <label>
      <input type="checkbox" value="${g}" checked /> ${g}
    </label><br/>
  `;
});

filterDiv.addEventListener('change', () => {
  const grades = [...filterDiv.querySelectorAll('input:checked')]
    .map(i => i.value);

  const query = grades.length ? `?grades=${grades.join(',')}` : '';
  fetchMapPoints(query).then(renderMarkers);
});
