//desconsiderar a url se formos usar outra api.aaaaaaa

async function buscarClima(lat, lon) {
    const lat = -30.03;
    const lon = -51.23
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    try {
        const resposta = await fetch(url);
        const data = await Response.json();

        const temp = data.current.temperature_2m;
        const code = data.current.weather_code;

        console.log(`Temperatura em POA: ${temp}°C`);
        console.log(`Código do tempo (WMO): ${code}`);

        exibirNaTela(temp, code);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

function traduzirCodigoTempo(codigo) {
    const interpretacao = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        61: "Chuva leve",
        // Adicione os outros códigos da tabela que você postou...
    };
    return interpretacao[codigo] || "Condição desconhecida";
}