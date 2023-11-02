document.getElementById('getLocation').addEventListener('click', function() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const altitude = position.coords.altitude || 'Não Disponível';

            
            
            document.getElementById('latitude').textContent = latitude.toFixed(2);
            document.getElementById('altitude').textContent = altitude;

            // Chama a função para obter dados meteorológicos
            await getWeatherData(latitude, longitude);
        });
    } else {
        alert('Geolocalização não é suportada por este navegador.');
    }
});

async function getWeatherData(latitude, longitude) {
    const apiKey = 'cb63fa4e-7987-11ee-995e-0242ac130002-cb63fad0-7987-11ee-995e-0242ac130002'; 
    const params = 'airTemperature,windSpeed,windDirection,humidity,cloudCover';
    const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${params}`, {
        headers: {
            'Authorization': apiKey
        }
    });

    if (!response.ok) {
        alert('Erro ao obter dados meteorológicos: ' + response.statusText);
        return;
    }

    const data = await response.json();
    const weather = data.hours[0];

    // Atualiza os dados na página
    document.getElementById('temperature').textContent = weather.airTemperature.noaa;
    //document.getElementById('uvIndex').textContent = weather.uvIndex.noaa;
    document.getElementById('windSpeed').textContent = weather.windSpeed.noaa;
    document.getElementById('windDirection').textContent = weather.windDirection.noaa; // Adiciona a direção do vento
    document.getElementById('humidity').textContent = weather.humidity.noaa;
    document.getElementById('cloudCoverage').textContent = weather.cloudCover.noaa;
    //document.getElementById('elevation').textContent = weather.elevation.noaa;

    // As seguintes informações não estão disponíveis diretamente e podem necessitar de cálculos adicionais ou outra API
    document.getElementById('lightIntensity').textContent = 'N/A';
    document.getElementById('ozoneLayerThickness').textContent = 'N/A';
    document.getElementById('timeOfDay').textContent = new Date().toLocaleTimeString();
    document.getElementById('surfaceReflection').textContent = 'N/A';
}
