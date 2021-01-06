const router = require('express').Router(),
    discord = require('./modules/discord-api'),
    sass = require('sass'),
    pug = require('pug')

let sendJSON = (res, data) => {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(data, null, 4));
}

let checkSession = (req, res, next) => {
    if (!req.session || !req.session.bot) {
        let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        req.session.oldURL = fullUrl;
        res.redirect('/login');
    }
    else next();
}

router.get('/', async (req, res) => {
    if (!req.session || !req.session.bot) res.redirect('/login');
    else res.redirect('/channels');
});

router.route('/login')
    .get(async (req, res) => {
        let oldURL = [false];
        if (req.session.oldURL) oldURL = [true, req.session.oldURL];
        res.send(pug.renderFile(`${__dirname}/views/login.pug`, {
            STYLE: sass.renderSync({file: `${__dirname}/scss/login.scss`}).css.toString(),
            HAS_OLD_URL: oldURL,
        }));
    })
    .post(async (req, res) => {
        if (!req.body.discordToken) return res.redirect('/');
        let bot = await discord.getSelf(req.body.discordToken);

        if (Object.keys(bot).length == 0) return res.redirect('/login?msg=Invalid Token');
        if (bot['bot'] == true) {
            bot["token"] = req.body.discordToken;
            req.session.bot = bot;

            if (req.body.oldURL) res.redirect(req.body.oldURL);
            else res.redirect('/channels');
        }
        else res.redirect('/login?msg=Not a Bot');
    })

router.get('/channels/:server?/:channel?', checkSession, async (req, res) => {
    if (!req.params.server) res.redirect('/channels/@me');
    else {
        if (req.params.channel) {
            if (req.params.server == "@me") res.send("COMING SOON");
            else res.send(pug.renderFile(`${__dirname}/views/main.pug`, {
                STYLE: sass.renderSync({file: `${__dirname}/scss/main.scss`}).css.toString(),
                GUILD: req.params.server,
                GUILDS: await discord.getGuilds(req.session.bot.token),
                CHANNELS: await discord.getGuildChannels(req.session.bot.token, req.params.server),
                BOT: req.session.bot,
            }));
        }
        else {
            res.send(pug.renderFile(`${__dirname}/views/main.pug`, {
                STYLE: sass.renderSync({file: `${__dirname}/scss/main.scss`}).css.toString(),
                GUILD: req.params.server,
                GUILDS: await discord.getGuilds(req.session.bot.token),
                CHANNELS: await discord.getGuildChannels(req.session.bot.token, req.params.server),
                BOT: req.session.bot,
            }));
        }
    }
});

module.exports = router;