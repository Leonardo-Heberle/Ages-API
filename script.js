//desconsiderar a url se formos usar outra api.
async function buscarClima(lat = -30.03, lon = -51.23, nomeCidade = "Porto Alegre", mostrarLoading = false) {
    const elLoading = document.getElementById('loading');
    const elConteudo = document.getElementById('weatherContent');

    //esconder o conteudo e mostrar o loading
    if (mostrarLoading) {
        if (elLoading) elLoading.classList.remove('hidden');
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=auto&models=icon_global`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao acessar a API");

        const data = await resposta.json();

        const temp = data.current.temperature_2m;
        const code = data.current.weather_code;
        const umidade = data.current.relative_humidity_2m;
        const vento = data.current.wind_speed_10m;
        const sensacao = data.current.apparent_temperature;

        console.log(`Dados recebidos - Temp: ${temp}, Code: ${code}, Sensacao: ${sensacao}`);

        exibirNaTela(temp, code, umidade, vento, sensacao, nomeCidade);


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
        51: "Garoa leve",
        61: "Chuva leve",
        63: "Chuva moderada",
        71: "Neve leve",
        73: "Neve moderada",
        75: "Neve forte",
        77: "Grãos de neve",
        80: "Pancadas de chuva",
        85: "pancadas de neve leves",
        86: "Pancadas de neve fortes",
        95: "Trovoada"
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


function exibirNaTela(temp, code, umidade, vento, sensacao, nomeCidade) {
    // 1. Localizar os elementos do DOM (IDs do seu HTML)
    const elCidade = document.getElementById('cidade');
    const elTemp = document.getElementById('temperatura');
    const elCondicao = document.getElementById('descricao');
    const elIcone = document.getElementById('weatherIcon'); // O ID da div .icone-clima
    const elUmidade = document.getElementById('umidade');
    const elVento = document.getElementById('vento');
    const elData = document.getElementById('data');
    const elSensacao = document.getElementById('sensacao');

    // 2. Traduzir e buscar o ícone da OpenWeather (usando a função que criamos)
    const textoCondicao = traduzirCodigoTempo(code);
    const urlIcone = getOpenWeatherIcon(code);

    // 3. Atualizar os textos na tela
    if (elCidade) elCidade.textContent = nomeCidade;
    if (elTemp) elTemp.textContent = `${Math.round(temp)}`;
    if (elCondicao) elCondicao.textContent = textoCondicao;
    if (elUmidade) elUmidade.textContent = `${Math.round(umidade)}`;
    if (elVento) elVento.textContent = `${Math.round(vento)}`;
    if (elSensacao) elSensacao.textContent = sensacao;

    // 4. Injetar o ícone corretamente
    if (elIcone) {
        // Inserimos a imagem com uma classe para você controlar no CSS se precisar
        elIcone.innerHTML = `<img src="${urlIcone}" alt="${textoCondicao}" class="icone-clima">`;
    }

    // 5. Atualizar a data (opcional, mas deixa o layout do Figma completo)
    if (elData) {
        const hoje = new Date();
        const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
        elData.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarClima();

    document.getElementById('formulario-busca-clima').addEventListener('submit', (e) => {
        e.preventDefault();
        const cidade = document.getElementById('cityInput').value.trim();
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