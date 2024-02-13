// Import required modules
import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import slugify from 'slugify';

// Create a new RSS parser
let parser = new Parser();

// Define the RSS feed URL
let feedUrl = 'https://anchor.fm/s/5ba5d22c/podcast/rss';

// Fetch and parse the RSS feed
parser.parseURL(feedUrl).then(feed => {
  // Map the feed items to the desired format
  let episodes = feed.items.map(item => ({
    title: item.title.replace(/["\n]/g, '\\$&'), // Escape special characters
    description: item.contentSnippet.replace(/\n/g, '  \n').replace(/https?:\/\/\S+/g, (url) => `[${url}](${url})`), // Escape special characters
    pubDate: new Date(item.pubDate).toDateString(),
    duration: item.itunes.duration,
    size: Number(item.enclosure.length) / (1024 * 1024), // Convert bytes to megabytes and ensure it's a number
    cover: item.itunes.image,
    explicit: item.itunes.explicit === 'yes', // Convert to boolean
    episode: item.itunes.episode,
    season: item.itunes.season,
    episodeType: item.itunes.episodeType,
    audioUrl: item.enclosure.url
  }));


  // Save each episode to a separate Markdown file
  for (let episode of episodes) {
    let slug = slugify(episode.title, { lower: true, strict: true });
    let filePath = path.join('./src/content/episode', `${slug}.md`);
    let content = `---
title: "${episode.title}"
audioUrl: "${episode.audioUrl}"
pubDate: "${episode.pubDate}"
duration: "${episode.duration}"
size: ${episode.size.toFixed(2)} 
cover: "${episode.cover}"
explicit: ${episode.explicit}
episode: ${episode.episode}
season: ${episode.season}
episodeType: "${episode.episodeType}"
---

${episode.description}`;
    fs.writeFileSync(filePath, content);
  }
}).catch(error => {
  console.error(error);
});