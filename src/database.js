import mongoose from 'mongoose';
mongoose.connect("mongodb+srv://r3id3n2091:r3id3n2091@aniwear.i4ffyt6.mongodb.net/aniwear?retryWrites=true&w=majority&appName=aniwear")
    .then(() => console.log("Conexión exitosa a la base de datos"))
    .catch((error) => console.log("Error de conexión a la base de datos", error));