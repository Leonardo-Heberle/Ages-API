//desconsiderar a url se formos usar outra api.
async function buscarClima() {
    //coordenadas mockadas,
    const lat = -30.03;
    const lon = -51.23;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature&timezone=auto`;
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

        exibirNaTela(temp, code, umidade, vento, sensacao);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        const elCondicao = document.getElementById('descricao')
        if (elCondicao) elCondicao.textContent = "Erro ao carregar dados";
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

function getOpenWeatherIcon(codigoMeteo) { //isso aqui pega o codigo do openMeteo e mando pro OpenWeather que tem a biblioteca de icones
    // MAPEAMENTO: Código Open-Meteo -> Código de Imagem OpenWeather
    const mapeamento = {
        0: "01d",  // Céu limpo -> sun.png
        1: "02d",  // Principalmente limpo -> partly-cloudy.png
        2: "03d",  // Parcialmente nublado -> cloudy.png
        3: "04d",  // Encoberto -> broken-clouds.png
        45: "50d", // Nevoeiro -> mist.png
        51: "09d", // Garoa -> shower-rain.png
        61: "10d", // Chuva leve -> rain.png
        63: "10d", // Chuva moderada
        80: "09d", // Pancadas de chuva
        95: "11d"  // Trovoada -> thunderstorm.png
    };
    // Pega o código da imagem ou usa "01d" (sol) como padrão de segurança
    const iconCode = mapeamento[codigoMeteo] || "01d";
    const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    return url;
}


function exibirNaTela(temp, code, umidade, vento, sensacao) {
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
    if (elCidade) elCidade.textContent = "Porto Alegre";
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

document.addEventListener('DOMContentLoaded', buscarClima);

