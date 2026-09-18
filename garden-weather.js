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

  let html = `
    <div style="background: var(--paper); border: 1px solid var(--forest-light); border-radius: 22px; padding: 23px; margin: 20px 0; box-shadow: var(--shadow);">
      <h3 style="margin-top: 0; margin-bottom: 15px; color: var(--forest); display: flex; align-items: center; gap: 10px;">
        <span aria-hidden="true" style="font-size: 1.5rem; background: #e6f0e6; border-radius: 12px; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;">🌤️</span>
        Météo & Jardin
      </h3>
  `;

  if (data) {
    const currentTemp = data.current.temperature_2m;
    const minTemps = data.daily.temperature_2m_min;

    // Check if temp drops to <= 1°C in next 3 days
    const isFreezingExpected = minTemps.some(temp => temp <= 1);

    html += `
      <p style="margin: 0 0 10px; color: var(--ink);"><strong>Actuellement :</strong> ${currentTemp}°C</p>
    `;

    if (isFreezingExpected) {
      html += `
        <div style="background: #fdf2f2; border: 1px solid #f9d8d8; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
          <p style="margin: 0; color: #a93232; font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <span aria-hidden="true">❄️</span>
            Alerte Gel : Température ≤ 1°C prévue dans les 72h !
          </p>
          <p style="margin: 8px 0 0; color: #a93232; font-size: 0.9rem;">
            N'oubliez pas de rentrer les plantes sensibles et de <strong>purger les robinets extérieurs</strong>.
          </p>
        </div>
      `;
    }
  } else {
    // Offline fallback
    html += `
      <p style="margin: 0 0 15px; color: var(--muted); font-size: 0.9rem;"><em>Météo indisponible (mode hors-ligne)</em></p>
    `;
  }

  html += `
      <div style="background: #f5f8f5; border-radius: 12px; padding: 15px;">
        <h4 style="margin: 0 0 8px; color: var(--forest-light); font-size: 0.95rem;">🌱 Conseil du mois</h4>
        <p style="margin: 0; color: var(--ink); font-size: 0.9rem; line-height: 1.4;">${seasonalAdvice}</p>
      </div>
    </div>
  `;

  widgetContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchWeather();
  renderWeatherWidget(data);
});
