const GARDEN_TASKS = {
  0: "Janvier : Surveillez les protections d'hivernage et taillez les arbres à pépins si le temps le permet.",
  1: "Février : Préparez les semis sous abri et finissez la taille des arbres fruitiers.",
  2: "Mars : Reprenez la tonte doucement. Aérez le gazon et commencez les plantations de printemps.",
  3: "Avril : Désherbez régulièrement. Paillez les massifs pour conserver l'humidité.",
  4: "Mai : C'est le moment de planter les annuelles après les Saints de Glace. Tondez régulièrement.",
  5: "Juin : Arrosez le soir ou tôt le matin. Paillez les cultures pour limiter l'évaporation.",
  6: "Juillet : Récoltez au potager. Surveillez l'arrosage pendant les fortes chaleurs.",
  7: "Août : Taillez les haies et continuez les récoltes. Préparez les plantations d'automne.",
  8: "Septembre : Scarifiez la pelouse, plantez les bulbes de printemps et divisez les vivaces.",
  9: "Octobre : Ramassez les feuilles mortes. Rentrez les plantes gélives et purgez le circuit extérieur si nécessaire.",
  10: "Novembre : Purge obligatoire du circuit extérieur (robinets). Protégez les plantes sensibles et remisez les outils.",
  11: "Décembre : Hivernage complet. Protégez vos plantes avec un voile et laissez reposer le jardin."
};

const LAT = 48.1444;
const LON = 1.0506;

async function fetchWeather() {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m&daily=temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3`);
    if (!response.ok) throw new Error('Weather API failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

function renderWeatherWidget(data) {
  const widgetContainer = document.getElementById('weather-widget');
  if (!widgetContainer) return;

  const currentMonth = new Date().getMonth();
  const seasonalAdvice = GARDEN_TASKS[currentMonth];

  // Create mode-heading similar to mode-cards in index.html
  let html = `
    <div class="mode-heading">
      <span class="mode-icon" aria-hidden="true">🌤️</span>
      <h2>Météo & Jardin</h2>
    </div>
  `;

  if (data) {
    const currentTemp = data.current.temperature_2m;
    const minTemps = data.daily.temperature_2m_min;

    // Check if temp drops to <= 1°C in next 3 days
    const isFreezingExpected = minTemps.some(temp => temp <= 1);

    html += `
      <p>Actuellement : <strong>${currentTemp}°C</strong></p>
    `;

    if (isFreezingExpected) {
      html += `
        <div style="background: #fdf2f2; border: 1px solid #f9d8d8; border-radius: 12px; padding: 12px; margin: 15px 0;">
          <p style="margin: 0; color: #a93232; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span aria-hidden="true">❄️</span>
            Alerte Gel : ≤ 1°C dans les 72h !
          </p>
          <p style="margin: 6px 0 0; color: #a93232; font-size: 0.8rem; line-height: 1.3;">
            Rentrez les plantes gélives et <strong>purgez les robinets ext.</strong>
          </p>
        </div>
      `;
    }
  } else {
    // Offline fallback
    html += `
      <p style="font-size: 0.9rem; margin-top: 15px;"><em>Météo indisponible (hors-ligne)</em></p>
    `;
  }

  html += `
    <div style="background: #e4f4e7; border-radius: 12px; padding: 12px; margin-top: 15px;">
      <h4 style="margin: 0 0 6px; color: #20613f; font-size: 0.85rem;">🌱 Conseil du mois</h4>
      <p style="margin: 0; color: #20613f; font-size: 0.8rem; line-height: 1.3;">${seasonalAdvice}</p>
    </div>
  `;

  widgetContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchWeather();
  renderWeatherWidget(data);
});
