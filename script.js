        document.addEventListener('DOMContentLoaded', () => {
            const submitButton = document.getElementById('submitButton');
            const cidadeInput = document.getElementById('cidadeInput');
            const phoneInput = document.getElementById('phoneInput');
            const alertModal = document.getElementById('alertModal');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const modalMessage = document.getElementById('modalMessage');


           
            function showModal(message) {
                modalMessage.textContent = message; 
                alertModal.classList.add('visible');
            }

   
            function hideModal() {
                alertModal.classList.remove('visible');
            }

            submitButton.addEventListener('click',async (event) => {
                event.preventDefault();

                const cidadeValue = document.querySelector('#cidadeInput').value;
                const phoneValue = document.querySelector('#phoneInput').value;
               
                if (cidadeValue === '' && phoneValue === '') {
                    showModal('Insira a cidade e o Celular.');
                }
                 else if (cidadeValue === '') {
                    showModal('Insira a cidade.');
                } 
                else if (phoneValue === '') {
                    showModal('Insira seu número de celular.');
                } 
                else {
                    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeValue}&appid=7a2791ab1c9e89014a098d47a489fb53&units-metric&lang-pt_br`
                    const results = await fetch(apiURL);
                    const json = await results.json();
                    console.log(json);
                    
                    if(json.cod == 200){
                        mostrarInfos({
                        city: json.name, // Nome da cidade
                        country: json.sys.country, // País
                        latitude: json.coord.lat, // Coordenada latitude
                        longitude: json.coord.lon, // Coordenada longitude
                        // Clima atual
                        weather_main: json.weather[0].main, // Tipo de clima (Clouds, Rain, Clear, etc.)
                        wather_desc: json.weather[0].description, // Descrição detalhada
                        // Temperatura
                        temp: json.main.temp, // Temperatura atual (K)
                        feels_like: json.main.feels_like, // Sensação térmica (K)
                        temp_min: json.main.temp_min, // Mínima
                        temp_max: json.main.temp_max, // Máxima
                        // Condições ambientais
                        humidity: json.main.humidity, // Umidade relativa (%)
                        pressure: json.main.pressure, // Pressão atmosférica (hPa)
                        wind_speed: json.wind.speed, // Velocidade do vento (m/s)
                        wind_deg: json.wind.deg, // Direção do vento (°)
                        clouds: json.clouds.all, // Cobertura de nuvens (%)
                        visibility: json.visibility, // Visibilidade (m)
                        // Informações do dia
                        sunrise: json.sys.sunrise, // Horário nascer do sol (timestamp)
                        sunset: json.sys.sunset, // Horário pôr do sol (timestamp)
                        timezone: json.timezone, // Fuso horário
                        description: json.weather[0].description,
                        tempIcon: json.weather[0].icon,
                    
                    });
                        showModal('Tudo certo! Agora fique de olho nas suas notificações para receber os futuros alertas!');

                    }else{
                        showModal('Cidade não encontrada.');
                    }

                }
            });

            function mostrarInfos(json){
                document.querySelector('')
            }


            closeModalBtn.addEventListener('click', hideModal);
    
            alertModal.addEventListener('click', (event) => {
                if (event.target === alertModal) {
                    hideModal();
                }
            });
        });
