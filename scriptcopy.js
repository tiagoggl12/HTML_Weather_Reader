document.getElementById('get-weather').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherData(latitude, longitude);
        document.getElementById('latitude').textContent = latitude;
        document.getElementById('longitude').textContent = longitude;
      }, function(error) {
        alert('Erro ao obter a localização: ' + error.message);
      });
    } else {
      alert('Geolocalização não é suportada por este navegador.');
    }
  });
  
  function fetchWeatherData(latitude, longitude) {
    const tempparms = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&minutely_15=temperature_2m,relativehumidity_2m,apparent_temperature,windspeed_10m,direct_radiation&hourly=cloudcover,uv_index&timezone=America%2FSao_Paulo&models=best_match`;
    const elevationparms = `https://api.open-meteo.com/v1/elevation?latitude=${latitude}&longitude=${longitude}`
  
    fetch(tempparms)
      .then(response => response.json())
      .then(data => {
        // Processa os dados meteorológicos recebidos
        // Atualize a UI com os dados recebidos
        document.getElementById('temperature').textContent = data.minutely_15.temperature_2m[0] + '°C';
        document.getElementById('elevation').textContent = data.elevation + ' M';
        document.getElementById('humidity').textContent = data.minutely_15.relativehumidity_2m[0] + '%';
        document.getElementById('apparent-temperature').textContent = data.minutely_15.apparent_temperature[0] + '°C';
        document.getElementById('wind-speed').textContent = data.minutely_15.windspeed_10m[0] + ' km/h';
        document.getElementById('direct-radiation').textContent = data.minutely_15.direct_radiation[0] + ' W/m²';
        document.getElementById('cloud-cover').textContent = data.hourly.cloudcover[0] + '%';
        document.getElementById('uv-index').textContent = data.hourly.uv_index[0];
        document.getElementById('timeOfDay').textContent = new Date().toLocaleTimeString();

        calcularDesconto()

      })
    fetch(elevationparms)
      .then(response1 => response1.json())
      .then(data1 => {
        document.getElementById('elevation').textContent = data1.elevation[0] + 'M';
        
      })
      .catch(error => {
        console.error('Erro ao obter dados meteorológicos:', error);
      });

        
  }
  function calcularDesconto() {
    let sensacao_termica = parseFloat(document.getElementById("apparent-temperature").textContent);
    let indice_uv = parseFloat(document.getElementById("uv-index").textContent);

    let desconto_base_uv = indice_uv * 7;
    let desconto_base_temperatura = (Math.abs(sensacao_termica - 40) / 40) * 30;
    
    let desconto_total = Math.round(Math.min(100, desconto_base_uv + desconto_base_temperatura));

    if (indice_uv === 0) {
        desconto_total = '0';
    }

    document.getElementById("resultado").textContent = desconto_total + "%";
  }
  