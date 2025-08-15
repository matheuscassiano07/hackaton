(async () => {


    // Coordenadas de SJC pra gente não errar
    const lat = "-23.1791"; 
    const lon = "-45.8872";
    
    
    const apiKey = "49b232b0509cc66eded6ee0411f64892"; 

    // O endereço do alvo
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    console.log("Preparando o disparo para:", url);

    // --- O DISPARO ---
    try {
        // 1. Vai buscar a encomenda
        const resposta = await fetch(url);

        // 2. Abre a caixa da encomenda
        const dados = await resposta.json();

        // 3. Se a encomenda veio com erro (chave errada, etc), a gente para aqui
        if (dados.cod) {
            console.error("ERRO RECEBIDO DA API:", dados.message);
            alert(`Deu ruim, cz! A API respondeu com erro: ${dados.message}`);
            return; // Para a execução
        }

        // 4. Se deu tudo certo, a gente grita BINGO e mostra o tesouro
        console.log("✅ SUCESSO! Previsão recebida:", dados);
        console.log("-------------------------------------------");
        console.log(`Temperatura atual: ${dados.current.temp}°C`);
        console.log(`Previsão pra próxima hora: ${dados.hourly[1].weather[0].description}`);
        console.log(`Chance de chuva na próxima hora: ${dados.hourly[1].pop * 100}%`);
        
        alert("É GOL! A API respondeu. Checa o console (F12) pra ver os dados!");

    } catch (erro) {
        // Se a internet cair ou der outro B.O., a gente avisa
        console.error("Ixi, erro na rede ou no código:", erro);
        alert("DEU B.O. NA CONEXÃO! Checa sua internet ou o console (F12) pra ver o erro.");
    }

})();
   
   
   
   
   // const URL = '';
            // const API_KEY = '49b232b0509cc66eded6ee0411f64892';

            // async function getWeather(){
            //     const response  = await fetch ('https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key})
            // }
