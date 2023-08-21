const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const path = require('path');
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

// Obtiene la direccion desde coordenadas
app.get('/coordenadas', async(req, res) => {
  const lat = req.query.lat;
  const lng = req.query.lng; 
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
// ontener coordenadas desde direccion
app.get('/direccion', async (req, res) => {
  const direccion = req.query.direccion; 
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
  try {
    const response = await axios.get(apiUrl);
    if (response.data && response.data.length > 0) {
      const coordenadas = {
        lat: response.data[0].lat,
        lng: response.data[0].lon
      };
      res.json({ coordenadas });
    } else {
      res.status(404).json({ error: 'Coordenadas no encontradas para la dirección proporcionada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }


});

//Guardar ubicacion de alguna ruta con ayuda de un formulario
app.post('/guardar-ubicacion', (req, res) => {
  const nuevaUbicacion = req.body;

  // Realiza una solicitud POST directamente a la URL de Firebase
  axios.post('https://rutasciclista2023-default-rtdb.firebaseio.com/data.json', nuevaUbicacion)
    .then(response => {
      res.status(201).json({ message: 'Ubicación guardada exitosamente' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al guardar la ubicación' });
    });
});

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html'); 
  res.sendFile(indexPath);
});



