 async function buscarPrevisao() {
           
            const lat = "-23.1791"; 
            const lon = "-45.8872";
            const apiKey = "7a2791ab1c9e89014a098d47a489fb53"; 
            const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

            console.log("Chamando a API no endereço:", url);
            try {
                // Nosso "motoboy" (fetch) vai até o endereço buscar os dados
                const resposta = await fetch(url);

                // Se o motoboy não achar o endereço (erro de rede, chave errada, etc), a gente avisa
                if (!resposta.ok) {
                    throw new Error(`Erro na chamada: ${resposta.status}`);
                }

                // A "encomenda" (dados) chegou! A gente abre a caixa (transforma em .json)
                const dados = await resposta.json();

                // O GRITO DA VITÓRIA! Mostra a encomenda no console.
                console.log("RESPOSTA COMPLETA DA API:", dados);
                alert("DEU CERTO, CZ! Os dados do tempo chegaram. Olha o console (F12)!");

            } catch (erro) {
                // Se der qualquer B.O. no caminho, a gente mostra aqui.
                console.error("Ixi, deu ruim no teste:", erro);
                alert("DEU B.O.! Verifica sua chave de API ou o console (F12) pra ver o erro.");
            }
        }

        // Chama a função pra começar o teste
        buscarPrevisao();