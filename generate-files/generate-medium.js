const nunjucks = require('nunjucks');
const fs = require('fs');
const fetch = require('node-fetch');

const maxLength = 100 // maximum number of characters to extract
const mediumUsername = "albionbame";

nunjucks.configure('templates', { autoescape: false });

fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`)
    .then(response => response.json())
    .then(response => {
        if (response.status == 'ok') {
            const articles = [];
            for (const item of response.items) {
                let description = item.description
                    .substring(item.description.indexOf('</figure>') + 9)
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .substr(0, maxLength)
    
                //re-trim if we are in the middle of a word
                description = description.substr(
                    0,
                    Math.min(description.length, description.lastIndexOf(" "))
                )
    
                articles.push({title: item.title, link: item.link, description, image: item.thumbnail})
            }
    
            const html = nunjucks.render(`medium.html`, {articles});
            fs.writeFileSync('../medium.html', html);
        }
    });
