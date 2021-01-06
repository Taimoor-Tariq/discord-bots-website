const axios = require('axios').default;

exports.getSelf = (token) => {
    return new Promise(async resolve => {
        axios({
            method: "GET",
            url: "https://discord.com/api/users/@me",
            headers: {
                Authorization: `Bot ${token}`
            }
        })
        .then(res => { resolve(res.data) })
        .catch(e => { resolve({}) })
    })
}

exports.getGuild = (token, guildID) => {
    return new Promise(async resolve => {
        axios({
            method: "GET",
            url: `https://discord.com/api/users/@me/guilds/${guildID}`,
            headers: {
                Authorization: `Bot ${token}`
            }
        })
        .then(res => { resolve(res.data) })
        .catch(e => { resolve({}) })
    })
}

exports.getGuildChannels = (token, guildID) => {
    return new Promise(async resolve => {
        axios({
            method: "GET",
            url: `https://discord.com/api/guilds/${guildID}/channels`,
            headers: {
                Authorization: `Bot ${token}`
            }
        })
        .then(res => { resolve(res.data) })
        .catch(e => { resolve([]) })
    })
}

exports.getGuilds = (token) => {
    return new Promise(async resolve => {
        axios({
            method: "GET",
            url: "https://discord.com/api/users/@me/guilds",
            headers: {
                Authorization: `Bot ${token}`
            }
        })
        .then(res => { resolve(res.data) })
        .catch(e => { resolve([]) })
    })
}