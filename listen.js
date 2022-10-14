const app = require("./app");

const { PORT = 9090 } = process.env;

app.listen(port, () => {
    console.log(`Listening on ${PORT}...`);
});


