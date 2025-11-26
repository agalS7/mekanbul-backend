const mongoose = require("mongoose");
const DB_URI = "mongodb+srv://admin_webtek:2d0W5ntdbpuj2TKD@cluster-webtek.zwrjigj.mongodb.net/mekanbul?appName=Cluster-WebTek";
mongoose.connect(DB_URI);

require("./venue");

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
