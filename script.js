import { criarPreferenciaDePagamento } from './apis/payApi.js';
document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitButton");
    const cidadeInput = document.getElementById("cidadeInput");
    const nomeInput = document.getElementById("nomeInput");
    const phoneInput = document.getElementById("phoneInput");
    const alertModal = document.getElementById("alertModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalMessage = document.getElementById("modalMessage");
    const resilienceCenter = document.getElementById("resilience-center");
    const radarSection = document.getElementById("radar"); // Pega a seção do formulário
    const apiKey = "7a2791ab1c9e89014a098d47a489fb53";

    // Cria o espaço para a mensagem de boas-vindas
    const welcomeMessageContainer = document.createElement('div');
    welcomeMessageContainer.id = 'welcome-message';
    resilienceCenter.insertBefore(welcomeMessageContainer, resilienceCenter.firstChild);

    // Função única para buscar o clima e exibir as informações
    async function fetchAndDisplayWeather(cidade, nome) {
        try {
            // Obtém as coordenadas da cidade
            const geoApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br`;
            const geoResults = await fetch(geoApiURL);
            const geoJson = await geoResults.json();

            // Se a cidade não for encontrada, informa o usuário e para a execução
            if (geoJson.cod != 200) {
                showModal(`Cidade não encontrada: "${cidade}". Por favor, verifique e tente novamente.`);
                return false; // <-- MUDANÇA AQUI: Avisa que deu erro
            }

            const { lat, lon } = geoJson.coord;
            const cityName = geoJson.name;

            // Busca a previsão do tempo completa
            const oneCallApiURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric&lang=pt_br`;
            const oneCallResults = await fetch(oneCallApiURL);
            const data = await oneCallResults.json();
            
            // Oculta o formulário e exibe o painel de clima
            radarSection.style.display = 'none';
            resilienceCenter.style.display = "block";
            
            // Exibe a saudação ao usuário
            welcomeMessageContainer.innerHTML = `<h2 class="text-3xl font-bold mb-4 text-cyan-300 text-center">Olá, ${nome}!</h2>`;
            
            // Exibe as demais informações
            mostrarInfos(data, cityName);
            mostrarAlertas(data.alerts);
            mostrarPrevisao(data.daily);
            gerarAlertaClimatico(data);

            return true; // <-- MUDANÇA AQUI: Avisa que deu tudo certo

        } catch (error) {
            console.error("ERRO NA CHAMADA DA API:", error);
            showModal("Ocorreu um erro de conexão. Por favor, verifique sua internet.");
            return false; // <-- MUDANÇA AQUI: Avisa que deu erro
        }
    }

    // Verifica se o usuário já possui dados salvos
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        // Se sim, busca as informações do clima diretamente
        fetchAndDisplayWeather(userData.cidade, userData.nome);
    }

    function showModal(message) {
        modalMessage.textContent = message;
        alertModal.classList.add("visible");
    }

    function hideModal() {
        alertModal.classList.remove("visible");
    }

    // Evento de clique para novos usuários
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const cidadeValue = cidadeInput.value;
        const nomeValue = nomeInput.value;
        const phoneValue = phoneInput.value;

        if (!cidadeValue || !phoneValue || !nomeValue) {
            showModal("Por favor, preencha todos os campos.");
            return;
        }
        
        // <-- MUDANÇA AQUI: Primeiro a gente valida, DEPOIS a gente salva
        const isCityValid = await fetchAndDisplayWeather(cidadeValue, nomeValue);

        // Se a função de cima retornar 'true', aí sim a gente executa o resto
        if (isCityValid) {
            // Salva os dados do usuário no dispositivo
            const userData = {
                nome: nomeValue,
                cidade: cidadeValue,
                telefone: phoneValue,
                pontos: 100 // Pontos iniciais por se cadastrar
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            // Atualiza o ranking com o novo usuário
            atualizarRanking();
            
            // Mostra a mensagem de sucesso SÓ NO FINAL
            showModal("Dados salvos com sucesso no seu dispositivo.");
        }
    });
    
    // O restante do código permanece o mesmo...
    
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
        container.innerHTML = `<div class="alert-box alert-yellow"><p class="font-bold">Tudo certo!</p><p>Nenhum alerta meteorológico para sua região no momento.</p></div>`;
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

    function gerarAlertaClimatico(data) {
        const container = document.getElementById('alerts-container');
        let message = '';
        const weatherId = data.current.weather[0].id;
        const tempMax = data.daily[0].temp.max;
        const tempMin = data.daily[0].temp.min;

        // Condição para CHUVAS INTENSAS ou TEMPESTADES (IDs 200-531)
        if (weatherId >= 200 && weatherId <= 531) {
            message = `
                <div class="alert-box alert-red mt-4">
                    <p class="font-bold">🚨 ALERTA DE CHUVAS INTENSAS</p>
                    <p class="mb-2"><strong>Contexto Climático:</strong> A intensificação de eventos climáticos, como chuvas fortes, é uma das consequências documentadas das mudanças climáticas globais, que alteram os padrões de precipitação.</p>
                    <p><strong>Recomendação Sustentável:</strong> Verifique a limpeza de calhas e bueiros para garantir o escoamento adequado da água. Mantenha-se atento a áreas com risco de alagamento e, se possível, evite deslocamentos desnecessários.</p>
                </div>
            `;
        } 
        // Condição para ONDA DE CALOR (Temp. > 30°C)
        else if (tempMax > 30) {
            message = `
                <div class="alert-box alert-yellow mt-4">
                    <p class="font-bold">🔥 ALERTA DE ONDA DE CALOR</p>
                    <p class="mb-2"><strong>Contexto Climático:</strong> Ondas de calor mais frequentes e intensas são um claro indicativo do aquecimento global. A emissão de gases de efeito estufa potencializa a retenção de calor na atmosfera.</p>
                    <p><strong>Recomendação Sustentável:</strong> Hidrate-se constantemente e priorize o uso consciente de energia, especialmente de equipamentos como ar-condicionado. Desconectar aparelhos da tomada contribui para a redução do consumo.</p>
                </div>
            `;
        }
        // Condição para DIA ENSOLARADO (ID 800 - Céu Limpo)
        else if (weatherId === 800) {
            message = `
                <div class="alert-box alert-green mt-4">
                    <p class="font-bold">☀️ DIA ENSOLARADO</p>
                    <p class="mb-2"><strong>Contexto Climático:</strong> Dias ensolarados representam uma oportunidade para refletir sobre o potencial de fontes de energia renovável, como a solar, que é fundamental na transição para uma matriz energética mais limpa.</p>
                    <p><strong>Recomendação Sustentável:</strong> Aproveite a iluminação natural para reduzir o consumo de eletricidade. Considere utilizar meios de transporte de baixa emissão de carbono, como bicicletas ou caminhadas.</p>
                </div>
            `;
        }
        // Condição para QUEDA DE TEMPERATURA (Temp. < 15°C)
        else if (tempMin < 15) {
            message = `
                <div class="alert-box alert-blue mt-4">
                    <p class="font-bold">❄️ QUEDA ACENTUADA DE TEMPERATURA</p>
                    <p class="mb-2"><strong>Contexto Climático:</strong> As alterações climáticas podem influenciar a intensidade e a frequência de eventos de temperatura extrema. Ações de mitigação são essenciais para estabilizar esses padrões.</p>
                    <p><strong>Recomendação Sustentável:</strong> Para manter o conforto térmico, opte por um bom agasalho e pela vedação de frestas em portas e janelas antes de recorrer a aquecedores elétricos, que possuem alto consumo energético.</p>
                </div>
            `;
        }
        // Condição para DIA NUBLADO (IDs 801-804)
        else if (weatherId >= 801 && weatherId <= 804) {
            message = `
                <div class="alert-box alert-gray mt-4">
                    <p class="font-bold">☁️ DIA PREDOMINANTEMENTE NUBLADO</p>
                    <p class="mb-2"><strong>Contexto Climático:</strong> Nossas atividades diárias contribuem para a pegada de carbono global. O consumo consciente é uma ferramenta poderosa para a mitigação dos impactos climáticos, independentemente do tempo.</p>
                    <p><strong>Recomendação Sustentável:</strong> Adote práticas como a separação de resíduos para reciclagem. A gestão adequada do lixo reduz a emissão de gases de efeito estufa, como o metano, gerado em aterros sanitários.</p>
                </div>
            `;
        }
        
        if(message) {
            container.innerHTML += message;
        }
    }

    // --- INÍCIO DO CÓDIGO DE GAMIFICAÇÃO ---

    // Pega o botão de doação pelo novo ID
    const donateButton = document.getElementById("donateButton");

    // 1. DADOS FAKES + DADOS LOCAIS
    // Vamos criar uma lista de usuários fakes para o ranking não começar vazio
    let rankingData = [
        { nome: "Mariana S.", pontos: 1850 },
        { nome: "Carlos E.", pontos: 1700 },
        { nome: "Juliana P.", pontos: 1680 },
        { nome: "Ricardo A.", pontos: 1520 },
        { nome: "Ana L.", pontos: 1300 }
    ];

    // Função para ATUALIZAR O RANKING na tela
    function atualizarRanking() {
        const rankingBody = document.getElementById("ranking-body");
        
        // Pega os dados do usuário atual salvos no localStorage, se existirem
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
            const currentUser = JSON.parse(savedUserData);
            
            // Verifica se o usuário atual já está na lista do ranking
            const userIndex = rankingData.findIndex(user => user.nome === currentUser.nome);
            
            if (userIndex !== -1) {
                // Se já existe, atualiza os pontos
                rankingData[userIndex].pontos = currentUser.pontos || 0;
            } else {
                // Se não existe, adiciona ele
                rankingData.push({ nome: currentUser.nome, pontos: currentUser.pontos || 0 });
            }
        }
        
        // Ordena o ranking pelos pontos (do maior para o menor)
        rankingData.sort((a, b) => b.pontos - a.pontos);
        
        // Limpa a tabela antes de adicionar os novos dados
        rankingBody.innerHTML = "";
        
        // Cria as linhas da tabela para cada usuário
        rankingData.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.className = "border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors";
            
            tr.innerHTML = `
                <td class="p-3 font-bold text-cyan-400">${index + 1}º</td>
                <td class="p-3">${user.nome}</td>
                <td class="p-3 text-right font-bold">${user.pontos}</td>
            `;
            
            rankingBody.appendChild(tr);
        });
    }

    // 2. LÓGICA DE PONTUAÇÃO
    // Evento de clique no botão de doação
    donateButton.addEventListener("click", () => {
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
            let currentUser = JSON.parse(savedUserData);
            
            // Adiciona 150 pontos (ou o valor que você quiser) por clicar para doar
            currentUser.pontos = (currentUser.pontos || 0) + 150;
            
            // Salva os dados atualizados com os novos pontos
            localStorage.setItem('userData', JSON.stringify(currentUser));
            
            // Mostra um modal avisando dos pontos
            showModal(`${currentUser.nome}, você ganhou 150 pontos por apoiar a causa! Obrigado!`);
            
            // Atualiza o ranking na tela
            atualizarRanking();
        } else {
            // Se o usuário não estiver logado, avisa pra ele se cadastrar primeiro
            showModal("Você precisa se cadastrar na plataforma para ganhar pontos. Preencha seus dados no topo da página!");
        }
    });

    // --- FIM DO CÓDIGO DE GAMIFICAÇÃO ---
    closeModalBtn.addEventListener("click", hideModal);
    alertModal.addEventListener("click", (event) => {
        if (event.target === alertModal) {
            hideModal();
        }
    });

    // Finalmente, chama a função de atualizar o ranking uma vez quando a página carrega
    atualizarRanking();
});