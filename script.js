//desconsiderar a url se formos usar outra api.
async function buscarClima(lat, lon) {
    const lat = -30.03;
    const lon = -51.23
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao acessar a API");
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
    
    console.log("Código da API:", codigoMeteo, "URL gerada:", url); // Verifique isso no Console (F12)
    return url;
}


function exibirNaTela(temp, code, umidade, vento) {
    // 1. Localizar os elementos do DOM (IDs do seu HTML)
    const elCidade = document.getElementById('cityName');
    const elTemp = document.getElementById('temperature');
    const elCondicao = document.getElementById('condition');
    const elIcone = document.getElementById('weatherIcon'); // O ID da div .icone-clima
    const elUmidade = document.getElementById('humidity');
    const elVento = document.getElementById('windSpeed');
    const elData = document.getElementById('currentDate');

    // 2. Traduzir e buscar o ícone da OpenWeather (usando a função que criamos)
    const textoCondicao = traduzirCodigoTempo(code);
    const urlIcone = getOpenWeatherIcon(code);

    console.log(`[Debug] Temp: ${temp}, Code: ${code}, URL: ${urlIcone}`);

    // 3. Atualizar os textos na tela
    if (elCidade) elCidade.textContent = "Porto Alegre";
    if (elTemp) elTemp.textContent = `${Math.round(temp)}°`;
    if (elCondicao) elCondicao.textContent = textoCondicao;
    if (elUmidade) elUmidade.textContent = `${umidade}%`;
    if (elVento) elVento.textContent = `${vento} km/h`;

    // 4. Injetar o ícone corretamente
    if (elIcone) {
        // Inserimos a imagem com uma classe para você controlar no CSS se precisar
        elIcone.innerHTML = `<img src="${urlIcone}" alt="${textoCondicao}" class="weather-img">`;
    } else {
        console.error("Erro: O elemento #weatherIcon não foi encontrado no HTML.");
    }

    // 5. Atualizar a data (opcional, mas deixa o layout do Figma completo)
    if (elData) {
        const hoje = new Date();
        const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
        elData.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
    }
}

