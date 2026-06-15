const { DateTime } = luxon;

const zodiacSigns = [
  { name: '양자리', symbol: '♈' },
  { name: '황소자리', symbol: '♉' },
  { name: '쌍둥이자리', symbol: '♊' },
  { name: '게자리', symbol: '♋' },
  { name: '사자자리', symbol: '♌' },
  { name: '처녀자리', symbol: '♍' },
  { name: '천칭자리', symbol: '♎' },
  { name: '전갈자리', symbol: '♏' },
  { name: '사수자리', symbol: '♐' },
  { name: '염소자리', symbol: '♑' },
  { name: '물병자리', symbol: '♒' },
  { name: '물고기자리', symbol: '♓' },
];

const planetsMeta = [
  { key: 'Sun', label: '태양', glyph: '☉' },
  { key: 'Moon', label: '달', glyph: '☽' },
  { key: 'Mercury', label: '수성', glyph: '☿' },
  { key: 'Venus', label: '금성', glyph: '♀' },
  { key: 'Mars', label: '화성', glyph: '♂' },
  { key: 'Jupiter', label: '목성', glyph: '♃' },
  { key: 'Saturn', label: '토성', glyph: '♄' },
  { key: 'Uranus', label: '천왕성', glyph: '♅' },
  { key: 'Neptune', label: '해왕성', glyph: '♆' },
  { key: 'Pluto', label: '명왕성', glyph: '♇' },
];

const signTraits = {
  '양자리': '직진력, 개척정신, 빠른 결단력이 강한 에너지입니다.',
  '황소자리': '안정감, 감각적 취향, 꾸준함을 중시하는 에너지입니다.',
  '쌍둥이자리': '호기심, 언어 감각, 정보 교류가 활발한 에너지입니다.',
  '게자리': '보호 본능, 정서적 민감성, 유대감이 깊은 에너지입니다.',
  '사자자리': '자기표현, 창조성, 존재감이 선명한 에너지입니다.',
  '처녀자리': '분석력, 디테일, 실용성을 중시하는 에너지입니다.',
  '천칭자리': '균형감각, 관계성, 미적 취향이 돋보이는 에너지입니다.',
  '전갈자리': '집중력, 몰입, 심층적 통찰이 강한 에너지입니다.',
  '사수자리': '확장성, 이상, 탐험심이 강한 에너지입니다.',
  '염소자리': '책임감, 구조화, 장기 전략에 강한 에너지입니다.',
  '물병자리': '독창성, 독립성, 미래지향성이 강한 에너지입니다.',
  '물고기자리': '상상력, 공감성, 직관이 풍부한 에너지입니다.',
};

const planetMeanings = {
  '태양': '핵심 자아, 삶의 방향, 내가 빛나는 방식',
  '달': '감정 패턴, 본능, 정서적 안정 방식',
  '수성': '사고방식, 학습법, 말하고 연결하는 방식',
  '금성': '애정 표현, 취향, 관계에서 원하는 아름다움',
  '화성': '행동력, 추진력, 욕망을 실행하는 방식',
  '목성': '성장, 확장, 기회와 낙관이 열리는 방식',
  '토성': '책임, 한계, 성숙을 요구하는 과제',
  '천왕성': '변화, 혁신, 독립 욕구가 드러나는 방식',
  '해왕성': '상상력, 영감, 이상과 몽환의 영역',
  '명왕성': '변형, 집착, 깊은 힘과 재생의 영역',
};

const houseThemes = [
  '자기표현, 외모, 첫인상, 삶의 출발점',
  '가치관, 돈, 소유, 안정감',
  '학습, 언어, 가까운 인간관계, 이동',
  '가정, 뿌리, 정서적 기반',
  '사랑, 창의성, 즐거움, 자기표현',
  '일상, 건강, 습관, 실무 능력',
  '파트너십, 계약, 일대일 관계',
  '공유 자원, 심리, 변화, 깊은 결속',
  '철학, 여행, 고등 학습, 신념',
  '사회적 위치, 성취, 커리어 방향',
  '친구, 공동체, 미래 비전',
  '무의식, 휴식, 영성, 숨은 감정',
];

const form = document.getElementById('birth-form');
const placeSearchBtn = document.getElementById('place-search');
const placeInput = document.getElementById('birth-place');
const placeResults = document.getElementById('place-results');
const selectedPlaceEl = document.getElementById('selected-place');
const selectedCoordsEl = document.getElementById('selected-coords');
const selectedTimezoneEl = document.getElementById('selected-timezone');
const resultsEl = document.getElementById('results');
const emptyStateEl = document.getElementById('empty-state');

let selectedLocation = null;

placeSearchBtn.addEventListener('click', searchPlace);
placeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchPlace();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const birthDate = document.getElementById('birth-date').value;
  const birthTime = document.getElementById('birth-time').value;

  if (!birthDate || !birthTime) {
    alert('생년월일과 출생 시간을 입력해주세요.');
    return;
  }

  if (!selectedLocation) {
    alert('먼저 출생 장소를 검색하고 선택해주세요.');
    return;
  }

  try {
    const chartData = calculateNatalChart({
      date: birthDate,
      time: birthTime,
      location: selectedLocation,
    });

    renderResults(chartData);
  } catch (error) {
    console.error(error);
    alert('차트 계산 중 오류가 발생했습니다. 입력값을 다시 확인해주세요.');
  }
});

async function searchPlace() {
  const query = placeInput.value.trim();
  if (!query) {
    alert('도시와 국가를 입력해주세요.');
    return;
  }

  placeSearchBtn.disabled = true;
  placeSearchBtn.textContent = '검색 중...';

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'ko,en' }
    });
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      placeResults.classList.remove('hidden');
      placeResults.innerHTML = '<p class="helper-text">검색 결과가 없습니다. 영어 도시명으로 다시 시도해보세요.</p>';
      return;
    }

    placeResults.classList.remove('hidden');
    placeResults.innerHTML = data.map((place, index) => `
      <button type="button" class="place-option" data-index="${index}">
        ${place.display_name}
        <small>lat ${Number(place.lat).toFixed(4)} / lon ${Number(place.lon).toFixed(4)}</small>
      </button>
    `).join('');

    const buttons = placeResults.querySelectorAll('.place-option');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const item = data[Number(button.dataset.index)];
        const lat = Number(item.lat);
        const lon = Number(item.lon);
        const timezone = tzlookup(lat, lon);

        selectedLocation = {
          name: item.display_name,
          lat,
          lon,
          timezone,
        };

        selectedPlaceEl.textContent = item.display_name;
        selectedCoordsEl.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        selectedTimezoneEl.textContent = timezone;
        placeResults.classList.add('hidden');
      });
    });
  } catch (error) {
    console.error(error);
    alert('장소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    placeSearchBtn.disabled = false;
    placeSearchBtn.textContent = '장소 찾기';
  }
}

function calculateNatalChart({ date, time, location }) {
  const localDateTime = DateTime.fromISO(`${date}T${time}`, { zone: location.timezone });
  if (!localDateTime.isValid) {
    throw new Error('Invalid local datetime');
  }

  const utcDate = localDateTime.toUTC().toJSDate();
  const jd = julianDate(utcDate);
  const obliquity = meanObliquity(jd);
  const lst = localSiderealTime(jd, location.lon);
  const ascendant = calculateAscendant(lst, location.lat, obliquity);
  const houseCusps = Array.from({ length: 12 }, (_, i) => normalizeDegrees(ascendant + i * 30));

  const planets = planetsMeta.map((planet) => {
    const longitude = normalizeDegrees(Astronomy.EclipticLongitude(planet.key, utcDate));
    const sign = getSign(longitude);
    const house = getHouse(longitude, houseCusps);
    return {
      ...planet,
      longitude,
      sign,
      house,
      degreeInSign: normalizeDegrees(longitude % 30),
    };
  });

  const sun = planets.find((p) => p.label === '태양');
  const moon = planets.find((p) => p.label === '달');
  const ascSign = getSign(ascendant);

  return {
    utcDate,
    localDateTime,
    location,
    ascendant,
    ascSign,
    houseCusps,
    planets,
    sun,
    moon,
  };
}

function renderResults(data) {
  emptyStateEl.classList.add('hidden');
  resultsEl.classList.remove('hidden');

  renderSummary(data);
  renderPlanetTable(data.planets);
  renderCoreInterpretation(data);
  renderPlanetInterpretation(data.planets);
  renderHouseInterpretation(data.houseCusps);
  drawChart(data);
}

function renderSummary(data) {
  const cards = document.getElementById('summary-cards');
  cards.innerHTML = `
    <div class="summary-card">
      <span>태양궁</span>
      <strong>${data.sun.sign.symbol} ${data.sun.sign.name}</strong>
    </div>
    <div class="summary-card">
      <span>달궁</span>
      <strong>${data.moon.sign.symbol} ${data.moon.sign.name}</strong>
    </div>
    <div class="summary-card">
      <span>상승궁</span>
      <strong>${data.ascSign.symbol} ${data.ascSign.name}</strong>
    </div>
  `;
}

function renderPlanetTable(planets) {
  const container = document.getElementById('planet-table');
  container.innerHTML = `
    <table class="planet-table">
      <thead>
        <tr>
          <th>행성</th>
          <th>별자리</th>
          <th>도수</th>
          <th>하우스</th>
        </tr>
      </thead>
      <tbody>
        ${planets.map((planet) => `
          <tr>
            <td>${planet.glyph} ${planet.label}</td>
            <td>${planet.sign.symbol} ${planet.sign.name}</td>
            <td>${formatDegree(planet.degreeInSign)}</td>
            <td>${planet.house}하우스</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCoreInterpretation(data) {
  const el = document.getElementById('core-interpretation');
  el.innerHTML = `
    <div class="interpret-block">
      <h4>태양궁 — ${data.sun.sign.symbol} ${data.sun.sign.name}</h4>
      <p>${signTraits[data.sun.sign.name]} 태양은 삶의 중심 동력과 자아의 방향을 보여주므로, 당신은 이 성향을 통해 자신을 드러내는 편입니다.</p>
    </div>
    <div class="interpret-block">
      <h4>달궁 — ${data.moon.sign.symbol} ${data.moon.sign.name}</h4>
      <p>${signTraits[data.moon.sign.name]} 달은 감정 습관과 무의식적 반응을 뜻하므로, 마음이 안정될 때 이 특성이 자연스럽게 드러납니다.</p>
    </div>
    <div class="interpret-block">
      <h4>상승궁 — ${data.ascSign.symbol} ${data.ascSign.name}</h4>
      <p>${signTraits[data.ascSign.name]} 상승궁은 타인이 처음 느끼는 인상과 삶의 접근 방식을 나타냅니다. 새로운 환경에서 특히 강하게 보일 수 있습니다.</p>
    </div>
    <div class="interpret-block">
      <h4>출생 정보 요약</h4>
      <p>${data.location.name}<br>${data.localDateTime.toFormat('yyyy-LL-dd HH:mm')} (${data.location.timezone}) 기준으로 계산되었습니다.</p>
    </div>
  `;
}

function renderPlanetInterpretation(planets) {
  const el = document.getElementById('planet-interpretation');
  el.innerHTML = planets.map((planet) => `
    <div class="interpret-block">
      <h4>${planet.glyph} ${planet.label} in ${planet.sign.name} · ${planet.house}하우스</h4>
      <p>${planetMeanings[planet.label]}를 의미합니다. ${planet.sign.name}의 방식으로 표현되며, ${planet.house}하우스의 주제인 ${houseThemes[planet.house - 1]} 영역에서 특히 두드러집니다.</p>
    </div>
  `).join('');
}

function renderHouseInterpretation(houseCusps) {
  const el = document.getElementById('house-interpretation');
  el.innerHTML = houseCusps.map((cusp, index) => {
    const sign = getSign(cusp);
    return `
      <div class="interpret-block">
        <h4>${index + 1}하우스 시작점 — ${sign.symbol} ${sign.name}</h4>
        <p>${houseThemes[index]}와 관련된 장입니다. ${sign.name}의 기질을 통해 이 영역을 경험하고 다루는 경향이 강합니다.</p>
      </div>
    `;
  }).join('');
}

function drawChart(data) {
  const canvas = document.getElementById('natal-chart');
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const outer = 300;
  const zodiacInner = 220;
  const houseInner = 150;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(center, center, outer, 0, Math.PI * 2);
  ctx.fill();

  const rotation = degToRad(-data.ascendant + 180);

  for (let i = 0; i < 12; i++) {
    const start = rotation + degToRad(i * 30);
    const end = rotation + degToRad((i + 1) * 30);

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, outer, start, end);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(96,165,250,0.08)' : 'rgba(167,139,250,0.08)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, outer, start, end);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const angle = start + degToRad(15);
    const sign = zodiacSigns[i];
    const labelX = center + Math.cos(angle) * 255;
    const labelY = center + Math.sin(angle) * 255;
    ctx.fillStyle = '#eef2ff';
    ctx.font = '700 26px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sign.symbol, labelX, labelY);
  }

  ctx.beginPath();
  ctx.arc(center, center, zodiacInner, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center, center, houseInner, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  data.houseCusps.forEach((cusp, index) => {
    const angle = rotation + degToRad(cusp - data.ascendant);
    const x1 = center + Math.cos(angle) * houseInner;
    const y1 = center + Math.sin(angle) * houseInner;
    const x2 = center + Math.cos(angle) * outer;
    const y2 = center + Math.sin(angle) * outer;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = index === 0 ? '#f9a8d4' : 'rgba(255,255,255,0.18)';
    ctx.lineWidth = index === 0 ? 2.4 : 1.2;
    ctx.stroke();

    const houseAngle = angle + degToRad(15);
    const hx = center + Math.cos(houseAngle) * 185;
    const hy = center + Math.sin(houseAngle) * 185;
    ctx.fillStyle = '#dbe7ff';
    ctx.font = '600 14px Inter';
    ctx.fillText(`${index + 1}`, hx, hy);
  });

  const grouped = spreadPlanetAngles(data.planets.map((p) => ({ ...p, chartAngle: rotation + degToRad(p.longitude - data.ascendant) })));
  grouped.forEach((planet) => {
    const radius = 126 - planet.offsetLevel * 18;
    const x = center + Math.cos(planet.chartAngle) * radius;
    const y = center + Math.sin(planet.chartAngle) * radius;

    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15,23,42,0.92)';
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = '#eef2ff';
    ctx.font = '700 18px Inter';
    ctx.fillText(planet.glyph, x, y + 1);
  });

  ctx.beginPath();
  ctx.arc(center, center, 62, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.stroke();

  ctx.fillStyle = '#eef2ff';
  ctx.font = '700 20px Inter';
  ctx.fillText('Natal', center, center - 10);
  ctx.font = '500 14px Inter';
  ctx.fillStyle = '#b8c0d9';
  ctx.fillText(`${data.ascSign.symbol} ASC`, center, center + 16);
}

function spreadPlanetAngles(planets) {
  const sorted = [...planets].sort((a, b) => a.chartAngle - b.chartAngle);
  const threshold = degToRad(7);
  let cluster = [];

  function flushCluster() {
    cluster.forEach((planet, index) => {
      planet.offsetLevel = index;
    });
    cluster = [];
  }

  for (const planet of sorted) {
    if (!cluster.length) {
      cluster.push(planet);
      continue;
    }
    const prev = cluster[cluster.length - 1];
    if (Math.abs(planet.chartAngle - prev.chartAngle) < threshold) {
      cluster.push(planet);
    } else {
      flushCluster();
      cluster.push(planet);
    }
  }
  flushCluster();
  return sorted;
}

function getSign(longitude) {
  const index = Math.floor(normalizeDegrees(longitude) / 30) % 12;
  return zodiacSigns[index];
}

function getHouse(longitude, cusps) {
  const normalized = normalizeDegrees(longitude);
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (isDegreeBetween(normalized, start, end)) {
      return i + 1;
    }
  }
  return 1;
}

function isDegreeBetween(value, start, end) {
  if (start <= end) return value >= start && value < end;
  return value >= start || value < end;
}

function formatDegree(value) {
  const deg = Math.floor(value);
  const min = Math.round((value - deg) * 60);
  return `${deg}° ${String(min).padStart(2, '0')}′`;
}

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

function julianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function meanObliquity(jd) {
  const T = (jd - 2451545.0) / 36525;
  const seconds = 21.448 - T * (46.8150 + T * (0.00059 - T * 0.001813));
  return 23 + 26 / 60 + seconds / 3600;
}

function localSiderealTime(jd, longitude) {
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = normalizeDegrees(gmst);
  return normalizeDegrees(gmst + longitude);
}

function calculateAscendant(lstDeg, latDeg, obliquityDeg) {
  const theta = degToRad(lstDeg);
  const phi = degToRad(latDeg);
  const eps = degToRad(obliquityDeg);

  const numerator = -Math.cos(theta);
  const denominator = Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  const lambda = radToDeg(Math.atan2(numerator, denominator));
  return normalizeDegrees(lambda);
}
