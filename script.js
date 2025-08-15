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
                    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeValue}&appid=49b232b0509cc66eded6ee0411f64892&units-metric&lang-pt_br`
                    const results = await fetch(apiURL);
                    const json = await results.json();
                    console.log(json);
                    
                    if(json.cod == 200){
                        showModal('Tudo certo! Agora fique de olho nas suas notificações para receber os futuros alertas!');
                        


                    }else{
                        showModal('Cidade não encontrada.');
                    }

                }
            });

            function mostrarInfos(json){

            }


            closeModalBtn.addEventListener('click', hideModal);
    
            alertModal.addEventListener('click', (event) => {
                if (event.target === alertModal) {
                    hideModal();
                }
            });
        });
