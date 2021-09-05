const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database connected success'))
    .catch((error) => console.log('Database connected fail ' + error));
}