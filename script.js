document.getElementById('getLocation').addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
    

            
            
            document.getElementById('latitude').textContent = latitude;
            document.getElementById('longitude').textContent = longitude;
            console.log('pegou altitude, latitude e longitude')

            // Chama a função para obter dados meteorológicos
            await getWeatherData(latitude, longitude);
            console.log('Montou variável')

        });
    } else {
        alert('Geolocalização não é suportada por este navegador.');
    }
});

async function getWeatherData(latitude, longitude) {
    const apiKey = 'cb63fa4e-7987-11ee-995e-0242ac130002-cb63fad0-7987-11ee-995e-0242ac130002'; 
    const params = 'airTemperature,windSpeed,windDirection,humidity,cloudCover';
    const solarParams = 'uvIndex';

    console.log('definiu parametros')
    const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${params}`, {
        headers: {
            'Authorization': apiKey
        }
    })

    if (!response.ok) {
        alert('Erro ao obter dados meteorológicos: ' + response.statusText);
        return;
    }
    console.log('leu API weather')
    const solarResponse = await fetch(`https://api.stormglass.io/v2/solar/point?lat=${latitude}&lng=${longitude}&params=${solarParams}`, {
        headers: {
            'Authorization': apiKey
        }
    });

    if (!solarResponse.ok) {
        alert('Erro ao obter dados solares: ' + solarResponse.statusText);
        return;
    }
    console.log('leu API UV')
    const elevationResponse = await fetch(`https://api.stormglass.io/v2/elevation/point?lat=${latitude}&lng=${longitude}`, {
        headers: {
            'Authorization': apiKey
        }
    });
    console.log('leu API elevation')
    if (!elevationResponse.ok) {
        alert('Erro ao obter dados de elevação: ' + elevationResponse.statusText);
        return;
    }

    const data = await response.json();
    const weather = data.hours[0];
    const solarData = await solarResponse.json();
    const solar = solarData.hours[0];
    const elevationData = await elevationResponse.json();
    const elevation = elevationData;

    // Atualiza os dados na página
    document.getElementById('temperature').textContent = weather.airTemperature.noaa;
    document.getElementById('uvIndex').textContent = solar.uvIndex.noaa;
    document.getElementById('windSpeed').textContent = weather.windSpeed.noaa;
    document.getElementById('windDirection').textContent = weather.windDirection.noaa; // Adiciona a direção do vento
    document.getElementById('humidity').textContent = weather.humidity.noaa;
    document.getElementById('cloudCoverage').textContent = weather.cloudCover.noaa;
    document.getElementById('elevation').textContent = elevation.elevation;

    // As seguintes informações não estão disponíveis diretamente e podem necessitar de cálculos adicionais ou outra API
    document.getElementById('lightIntensity').textContent = 'N/A';
    document.getElementById('ozoneLayerThickness').textContent = 'N/A';
    document.getElementById('timeOfDay').textContent = new Date().toLocaleTimeString();
    document.getElementById('surfaceReflection').textContent = 'N/A';
    console.log('Apresentou fatores')
}
