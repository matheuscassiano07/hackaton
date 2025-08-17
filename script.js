document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submitButton");
  const cidadeInput = document.getElementById("cidadeInput");
  const phoneInput = document.getElementById("phoneInput");
  const alertModal = document.getElementById("alertModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalMessage = document.getElementById("modalMessage");
  const resilienceCenter = document.getElementById("resilience-center");
  const apiKey = "7a2791ab1c9e89014a098d47a489fb53";

  function showModal(message) {
    modalMessage.textContent = message;
    alertModal.classList.add("visible");
  }

  function hideModal() {
    alertModal.classList.remove("visible");
  }

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const cidadeValue = cidadeInput.value;
    const phoneValue = phoneInput.value;

    if (!cidadeValue || !phoneValue) {
      showModal("Preencha todos os campos.");
      return;
    }

    try {
      const geoApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeValue}&appid=${apiKey}&lang=pt_br`;
      const geoResults = await fetch(geoApiURL);
      const geoJson = await geoResults.json();

      if (geoJson.cod != 200) {
        showModal(`Cidade não encontrada. Digitou certo? -> "${cidadeValue}"`);
        return;
      }

      const lat = geoJson.coord.lat;
      const lon = geoJson.coord.lon;
      const cityName = geoJson.name;

      const oneCallApiURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric&lang=pt_br`;
      const oneCallResults = await fetch(oneCallApiURL);
      const data = await oneCallResults.json();

      resilienceCenter.style.display = "block";
      mostrarInfos(data, cityName);
      mostrarAlertas(data.alerts);
      mostrarPrevisao(data.daily);

      showModal("Visão completa do tempo carregada com sucesso!");
    } catch (error) {
      console.error("ERRO NA CHAMADA DA API:", error);
      showModal("Verifique sua internet ou o console (F12)!");
    }
  });

  function mostrarInfos(data, cityName) {
    const container = document.getElementById("weather-info");
    container.innerHTML = `
            <h2 class="text-3xl font-bold mb-4 text-cyan-300">Tempo agora em ${cityName}</h2>
            <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                <img src="https://openweathermap.org/img/wn/${
                  data.current.weather[0].icon
                }@4x.png" alt="Ícone do Tempo" class="w-32 h-32 -my-4">
                <div class="text-left">
                    <p class="text-7xl font-black">${data.current.temp.toFixed(
                      0
                    )}°C</p>
                    <p class="text-xl capitalize -mt-2">${
                      data.current.weather[0].description
                    }</p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8">
                <div class="history-item"><p class="history-value">${data.current.feels_like.toFixed(
                  0
                )}°</p><p class="history-label">Sensação</p></div>
                <div class="history-item"><p class="history-value">${
                  data.current.humidity
                }%</p><p class="history-label">Umidade</p></div>
                <div class="history-item"><p class="history-value">${(
                  data.current.wind_speed * 3.6
                ).toFixed(1)} km/h</p><p class="history-label">Vento</p></div>
                <div class="history-item"><p class="history-value">${data.daily[0].temp.max.toFixed(
                  0
                )}°</p><p class="history-label">Temp. Máx</p></div>
            </div>
        `;
  }

  function mostrarAlertas(alerts) {
    const container = document.getElementById("alerts-container");
    container.innerHTML = "";

    if (!alerts || alerts.length === 0) {
      container.innerHTML = `<div class="alert-box alert-yellow"><p class="font-bold">Tudo Liso!</p><p>Nenhum alerta meteorológico para sua região no momento.</p></div>`;
      return;
    }

    alerts.forEach((alert) => {
      const alertEl = document.createElement("div");
      alertEl.className = "alert-box alert-red mt-4";
      alertEl.innerHTML = `
                <p class="font-bold uppercase">🚨 ${alert.event}</p>
                <p class="text-sm mb-2">Fonte: ${alert.sender_name}</p>
                <p>${alert.description}</p>
            `;
      container.appendChild(alertEl);
    });
  }

  function mostrarPrevisao(dailyData) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";

    dailyData.slice(1, 5).forEach((day) => {
      const weekDay = new Date(day.dt * 1000).toLocaleDateString("pt-BR", {
        weekday: "short",
      });

      const dayEl = document.createElement("div");
      dayEl.className =
        "history-item flex flex-col justify-between items-center";
      dayEl.innerHTML = `
                <p class="font-bold text-lg capitalize">${weekDay}</p>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="${
        day.weather[0].description
      }" class="w-16 h-16 -my-2">
                <div>
                    <span class="font-bold text-cyan-300">${day.temp.max.toFixed(
                      0
                    )}°</span>
                    <span class="text-gray-400">${day.temp.min.toFixed(
                      0
                    )}°</span>
                </div>
            `;
      container.appendChild(dayEl);
    });
  }

  closeModalBtn.addEventListener("click", hideModal);
  alertModal.addEventListener("click", (event) => {
    if (event.target === alertModal) {
      hideModal();
    }
  });
});
