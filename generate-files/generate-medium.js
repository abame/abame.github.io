import nunjucks from 'nunjucks';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';

const { configure, render } = nunjucks;
const maxLength = 100 // maximum number of characters to extract
const mediumUsername = "albionbame";

configure('templates', { autoescape: false });

fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`)
    .then(response => response.json())
    .then(response => {
        if (response.status == 'ok') {
            const articles = [];
            for (const item of response.items) {
                let description = item.description
                    .substring(item.description.indexOf('</figure>') + 9)
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .replace('ss="medium-feed-item">', "")
                    .substr(0, maxLength)
    
                //re-trim if we are in the middle of a word
                description = description.substr(
                    0,
                    Math.min(description.length, description.lastIndexOf(" "))
                )
    
                articles.push({
                    title: item.title,
                    link: item.link,
                    description,
                    image: item.description.match(/\<img.+src\=(?:\"|\')(.+?)(?:\"|\')(?:.+?)\>/)[1]
                })
            }
    
            const html = render(`medium.html`, {articles});
            writeFileSync('../medium.html', html);
        }
    });
