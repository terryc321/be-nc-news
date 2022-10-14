const app = require("./app");

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

/*
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
    console.log(`Listening on ${port}...`);
});
*/
