//desconsiderar a url se formos usar outra api.

async function buscarClima(lat, lon) {
    const lat = -30.03;
    const lon = -51.23
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    try {
        const resposta = await fetch(url);
        if(!resposta.ok) throw new Error("Erro ao acessar a API");
        const data = await resposta.json();

        const temp = data.current.temperature_2m;
        const code = data.current.weather_code;
        const umidade = data.current.relative.humidity_2m;
        const vento = data.current.wind_speed_10m;

        console.log(`Temperatura em POA: ${temp}°C`);

        exibirNaTela(temp, code, umidade, vento);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        document.getElementById('condition').textContent = "Erro ao carregar Dados";
    }
}

function traduzirCodigoTempo(codigo) {
    const interpretacao = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        51: "Garoa leve",
        61: "Chuva leve",
        63: "Chuva moderada",
        80: "Pancadas de chuva",
        95: "Trovoada"
    };
    return interpretacao[codigo] || "Condição desconhecida";
}

function exibirNaTela(temp, code, umidade, vento) {
    document.getElementById('cityName').textContent = "Porto Alegre";
    document.getElementById('temperature').textContent = `${Math.round(temp)}°`;
    document.getElementById('condition').textContent = traduzirCodigoTempo(code);

}