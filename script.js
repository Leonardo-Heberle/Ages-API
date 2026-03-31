//desconsiderar a url se formos usar outra api.

async function buscarClima(lat, lon) {
    const apiKey = "a94b7e2a5bd3005217739f65c2eafc7f"; // retirada do site do openWeather
    // coordenadas para porto alegre
    const lat = -30.03;
    const lon = -51.23
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados ");

            const data = await resposta.json();
            atualizarInterface(data);
        }
    }catch (erro) {
        console.error("Erro ao buscar clima:", error);
    }
}


function atualizarInterface(data) {
    const temp = dados.current.tempo;
    const sensacao = data.current.feels_like;
    const descricao = data.current.weather[0].description;
    const icone = data.current.weather[0].icon;

    document.getElementById('temp').innerText = `${Math.round(temp)}°C`;
    document.getElementById('desc').innerText = descricao;
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icone}@2x.png`;
}