module.exports = (app, client) => {
    app.get('/', (req, res) => {
        res.send("Bot is online and running!");
    });
}