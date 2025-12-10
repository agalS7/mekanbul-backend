const mongoose = require("mongoose");

// const DB_URI = "mongodb://localhost:27017/mekanbul";
const DB_URI = process.env.MONGODB_URI;
mongoose.connect(DB_URI);

mongoose.connection.on("connected", () => {
    console.log(DB_URI + " adresindeki MongoDB Sunucusuna bağlanıldı!");
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Sunucusunun bağlantısı kesildi!");
});

mongoose.connection.on("error", () => {
    console.log("MongoDB Sunucusuna bağlanırken hata oluştu!");
});

process.on("SIGINT", () => {
    mongoose.connection.close();
    console.log("MongoDB Sunucusunun bağlantısı kapatıldı!");
    process.exit(0);
});
