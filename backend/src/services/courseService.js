const SkillCourse = require('../models/SkillCourse');
const { google } = require('googleapis');
const youtubeSearchApi = require('youtube-search-api');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY || 'dummy'
});

/**
 * Parses ISO 8601 duration (e.g. PT1H30M) to human readable string
 */
const parseDuration = (isoDur) => {
    if (!isoDur) return 'Unknown';
    const match = isoDur.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 'Unknown';
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    let res = [];
    if (h > 0) res.push(`${h} hr${h > 1 ? 's' : ''}`);
    if (m > 0 || (h === 0)) res.push(`${m} min`);
    return res.join(' ');
};

/**
 * Helper to fetch from YouTube API natively
 */
const fetchFromYouTubeAPI = async (query) => {
    try {
        const searchRes = await youtube.search.list({
            part: 'snippet',
            q: query,
            type: 'video',
            videoDuration: 'long',
            maxResults: 3
        });

        if (!searchRes.data.items || searchRes.data.items.length === 0) {
            return [];
        }

        const videoIds = searchRes.data.items.map(i => i.id.videoId);
        
        // Fetch detailed stats for duration
        const detailsRes = await youtube.videos.list({
            part: 'contentDetails',
            id: videoIds.join(',')
        });

        const durations = {};
        detailsRes.data.items.forEach(v => {
            durations[v.id] = parseDuration(v.contentDetails.duration);
        });

        return searchRes.data.items.map(item => ({
            title: item.snippet.title,
            platform: 'YouTube',
            url: `https://youtube.com/watch?v=${item.id.videoId}`,
            duration: durations[item.id.videoId] || 'Unknown'
        }));
    } catch (error) {
        console.error('YouTube API Error:', error.message);
        throw error;
    }
};

/**
 * Fallback using youtube-search-api
 */
const fetchFromScraper = async (query) => {
    try {
        const result = await youtubeSearchApi.GetListByKeyword(query, false, 3);
        const videos = result.items.slice(0, 3);
        
        return videos.map(v => ({
            title: v.title,
            platform: 'YouTube',
            url: `https://youtube.com/watch?v=${v.id}`,
            duration: v.length?.simpleText || 'Unknown'
        }));
    } catch (error) {
        console.error('Scraper Fallback Error:', error.message);
        return [];
    }
};

const fetchLocks = {};

exports.getCoursesForSkill = async (skill) => {
    const lowerSkill = skill.toLowerCase();
    
    // Check if another request is already fetching this skill
    if (fetchLocks[lowerSkill]) {
        return fetchLocks[lowerSkill];
    }
    
    // Create the promise for fetching and caching
    fetchLocks[lowerSkill] = (async () => {
        // 1. Check DB Cache
        const existing = await SkillCourse.findOne({ skill: lowerSkill });
        if (existing && existing.courses && existing.courses.length > 0) {
            return existing.courses;
        }

        // 2. Fetch externally
        let courses = [];
        const query = `${skill} tutorial full course`;
        
        try {
            // Only try official API if key is genuinely provided
            if (process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'your_youtube_api_key_here') {
                courses = await fetchFromYouTubeAPI(query);
            } else {
                throw new Error('No valid API Key');
            }
        } catch (apiError) {
            console.log(`Falling back to scraper for skill: ${skill}`);
            courses = await fetchFromScraper(query);
        }

        // Default placeholder if both fail
        if (courses.length === 0) {
            courses = [
                { title: `${skill} Documentation`, platform: 'Web', url: `https://google.com/search?q=${skill}+documentation`, duration: 'Self-paced' }
            ];
        }

        // 3. Cache Result in DB
        // First remove any existing blank stub
        await SkillCourse.deleteOne({ skill: lowerSkill });
        await SkillCourse.create({
            skill: lowerSkill,
            courses
        });

        return courses;
    })();

    try {
        const result = await fetchLocks[lowerSkill];
        return result;
    } finally {
        // Clean up the lock
        delete fetchLocks[lowerSkill];
    }
};
