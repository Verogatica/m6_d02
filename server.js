const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const nombreArchivo = 'canciones.json';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const leerArchivo = () => {
   return JSON.parse(fs.readFileSync(nombreArchivo, 'utf-8'));
}

app.get("/canciones", (req, res) => {
   const listaCanciones = leerArchivo();
   res.status(200).json(listaCanciones);
});

app.get("/canciones/:id", (req, res) => {
   const {id} = req.params;
   listaCanciones = leerArchivo();
   const cancion = listaCanciones.find(e => e.id === id);
   if (cancion) {
    res.status(200).json(cancion);
    } else {
    res.status(404).json({error: 'Canción no encontrada'});
    }
});

app.post("/canciones", (req, res) => {
    const data = req.body;
    listaCanciones = leerArchivo();
    listaCanciones.push(data);
    fs.writeFileSync(nombreArchivo, JSON.stringify(listaCanciones));
    res.status(201).json({resultado: true, cancion: data});
});

app.delete("/canciones/:id", (req, res) => {
    const {id} = req.params;
    let canciones = leerArchivo();
    canciones = canciones.filter(c => c.id != id);
    fs.writeFileSync(nombreArchivo, JSON.stringify(canciones), 'utf-8');
    res.status(204).json();
});

app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = req.body;

  const cancionMod = JSON.parse(fs.readFileSync("canciones.json"));
  
  const index = cancionMod.findIndex((cancion) => cancion.id == id);
  
  if (index !== -1) {
    cancionMod[index] = canciones;
    fs.writeFileSync("canciones.json", JSON.stringify(cancionMod), "utf8");
    res.send("La canción se ha modificado con éxito");
  } else {
    res.status(404).send("Canción no encontrada");
  }
});

app.listen(3000, () => {
    console.log('Servidor levantado en http://localhost:3000');
});
