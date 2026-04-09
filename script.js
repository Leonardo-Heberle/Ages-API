//desconsiderar a url se formos usar outra api.
async function buscarClima(lat = -30.03, lon = -51.23, nomeCidade = "Porto Alegre", mostrarLoading = false) {
    const elLoading = document.getElementById('loading');
    const elConteudo = document.getElementById('weatherContent');

    //esconder o conteudo e mostrar o loading
    if (mostrarLoading) {
        if (elLoading) elLoading.classList.remove('hidden');
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,visibility&timezone=auto&models=icon_global`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao acessar a API");

        const data = await resposta.json();

        const temp = data.current.temperature_2m;
        const code = data.current.weather_code;
        const umidade = data.current.relative_humidity_2m;
        const vento = data.current.wind_speed_10m;
        const sensacao = data.current.apparent_temperature;
        const visibilidade = data.current.visibility;

        console.log(`Dados recebidos - Temp: ${temp}, Code: ${code}, Sensacao: ${sensacao}`);

        exibirNaTela(temp, code, umidade, vento, sensacao, nomeCidade, visibilidade);


    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (elLoading) elLoading.innerHTML = "<p>Erro ao carregar dados.<p>";
    } finally {
        // Garante que o loading seja removido, mesmo em caso de erro.
        if (elLoading) elLoading.classList.add('hidden');
        if (elConteudo) elConteudo.classList.remove('hidden');
    }
}

function traduzirCodigoTempo(codigo) {
    const interpretacao = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Nevoeiro",
        48: "Nevoeiro depositado",
        51: "Garoa leve",
        53: "Garoa moderada",
        55: "Garoa forte",
        56: "Garoa congelada leve",
        57: "Garoa congelada forte",
        61: "Chuva leve",
        63: "Chuva moderada",
        65: "Chuva forte",
        66: "Chuva congelada leve",
        67: "Chuva congelada forte",
        71: "Neve leve",
        73: "Neve moderada",
        75: "Neve forte",
        77: "Grãos de neve",
        80: "Pancadas de chuva leves",
        81: "Pancadas de chuva moderadas",
        82: "Pancadas de chuva fortes",
        85: "Pancadas de neve leves",
        86: "Pancadas de neve fortes",
        95: "Trovoada",
        96: "Trovoada com granizo leve",
        99: "Trovoada com granizo forte"
    };
    return interpretacao[codigo] || "Condição desconhecida";
}

function getOpenWeatherIcon(codigoMeteo) {
    // Biblioteca com SVGs coloridos e estilo animado.
    const iconBase = "https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated";
    const mapeamento = {
        0: "day.svg",
        1: "cloudy-day-1.svg",
        2: "cloudy-day-2.svg",
        3: "cloudy.svg",
        45: "cloudy.svg",
        48: "cloudy.svg",
        51: "rainy-1.svg",
        53: "rainy-2.svg",
        55: "rainy-3.svg",
        56: "rainy-2.svg",
        57: "rainy-3.svg",
        61: "rainy-4.svg",
        63: "rainy-5.svg",
        65: "rainy-6.svg",
        66: "snowy-1.svg",
        67: "snowy-2.svg",
        71: "snowy-3.svg",
        73: "snowy-4.svg",
        75: "snowy-5.svg",
        77: "snowy-6.svg",
        80: "rainy-4.svg",
        81: "rainy-5.svg",
        82: "rainy-6.svg",
        85: "snowy-4.svg",
        86: "snowy-6.svg",
        95: "thunder.svg",
        96: "thunder.svg",
        99: "thunder.svg"
    };

    const iconFile = mapeamento[codigoMeteo] || "cloudy-day-1.svg";
    return `${iconBase}/${iconFile}`;
}


function exibirNaTela(temp, code, umidade, vento, sensacao, nomeCidade, visibilidade) {
    // 1. Localizar os elementos do DOM (IDs do seu HTML)
    const elCidade = document.getElementById('nomeCidade');
    const elTemp = document.getElementById('temperatura');
    const elCondicao = document.getElementById('condicao');
    const elIcone = document.getElementById('iconeClima');
    const elUmidade = document.getElementById('umidade');
    const elVento = document.getElementById('velocidadeVento');
    const elData = document.getElementById('dataAtual');
    const elSensacao = document.getElementById('sensacao');
    const elVisibilidade = document.getElementById('visibilidade');

    // 2. Traduzir e buscar o ícone da OpenWeather (usando a função que criamos)
    const textoCondicao = traduzirCodigoTempo(code);
    const urlIcone = getOpenWeatherIcon(code);

    // 3. Atualizar os textos na tela
    if (elCidade) elCidade.textContent = nomeCidade;
    if (elTemp) elTemp.textContent = `${Math.round(temp)}°`;
    if (elCondicao) elCondicao.textContent = textoCondicao;
    if (elUmidade) elUmidade.textContent = `${Math.round(umidade)}%`;
    if (elVento) elVento.textContent = `${Math.round(vento)} km/h`;
    if (elSensacao) elSensacao.textContent = `Sensação térmica ${Math.round(sensacao)}°`;
    if (elVisibilidade && typeof visibilidade === 'number') {
        elVisibilidade.textContent = `${(visibilidade / 1000).toFixed(1)} km`;
    }

    // 4. Injetar o ícone corretamente
    if (elIcone) {
        // Inserimos a imagem com uma classe para você controlar no CSS se precisar
        elIcone.innerHTML = `<img src="${urlIcone}" alt="${textoCondicao}" class="icone-clima-img">`;
    }

    // 5. Atualizar a data (opcional, mas deixa o layout do Figma completo)
    if (elData) {
        const hoje = new Date();
        const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
        const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
        // Capitalizar a primeira letra
        elData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarClima();

    document.getElementById('formularioBusca').addEventListener('submit', (e) => {
        e.preventDefault();
        const cidade = document.getElementById('imputCidade').value.trim();
        if (cidade) buscarPorCidade(cidade);
    });
    async function buscarPorCidade(cidade) {
        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
            const geoResp = await fetch(geoUrl);
            const geoData = await geoResp.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert("Cidade não encontrada!");
                return;
            }

            const { latitude, longitude, name } = geoData.results[0];
            await buscarClima(latitude, longitude, name, true);

        } catch (error) {
            console.error("Erro ao buscar cidade:", error);
        }
    }

});