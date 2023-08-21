const express = require('express');
const app = express();
const axios = require('axios');
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


app.get('/coordenadas', async(req, res) => {
  const lat = req.query.lat; // Obtén la latitud de la consulta
  const lng = req.query.lng; // Obtén la longitud de la consulta
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  try {
    const response = await axios.get(apiUrl);
    const address = response.data.display_name;
    res.json({ address });
    }
   catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

