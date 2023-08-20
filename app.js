const express = require('express');
const app = express();
const port = 3000;

/*Se implementara una base de datos en firebase para las consultas de las rutas establecidas*/
const routes = [
  {
    id: 1,
    name: "Ruta Escénica",
    location: "Montañas",
    difficulty: "Fácil",
  },
  {
    id: 2,
    name: "Ruta del Desafío",
    location: "Bosque",
    difficulty: "Moderada",
  },
  {
    id: 2,
    name: "Ruta Portete",
    location: "Bosque",
    difficulty: "Fácil",
  },
  // ... más rutas
];

app.get('/buscar', (req, res) => {
  const searchQuery = req.query.q;
  const matchedRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.json(matchedRoutes);
});

app.get('/filtrar', (req, res) => {
  const difficultyFilter = req.query.difficulty;
  const filteredRoutes = routes.filter(route =>
    route.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
  );

  res.json(filteredRoutes);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


app.get('/coordenadas/:lat/:lng', async(req, res) => {
  const axios = require('axios');
  const lat = req.params.lat;
  const lng = req.params.lng;

  const options = {
    method: 'GET',
    url: 'https://google-maps-geocoding.p.rapidapi.com/geocode/json',
    params: {
      latlng: `${lat},${lng}`,
      language: 'es'
    },
    headers: {
      'X-RapidAPI-Key': 'd269501636mshdb4433084ff6426p101263jsn8da775a0098c',
      'X-RapidAPI-Host': 'google-maps-geocoding.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
