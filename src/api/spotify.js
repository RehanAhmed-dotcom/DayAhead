import axios from 'axios';

const API_URL = 'https://plantflipsapp.com/dayAhead/api'; // no trailing slash

// Pass token as an argument from your component
export async function searchPodcasts(query, token) {
  if (!token) {
    console.error('No API token provided');
    return [];
  }

  try {
    const url = `${API_URL}/podcast_search?query=${encodeURIComponent(query)}`;
    console.log('Search Request URL:', url);

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Search API Response:', res.data);
    return res.data.shows?.items || [];
  } catch (err) {
    console.error('Search API error:', err.response?.data || err.message);
    return [];
  }
}

export async function getEpisodes(showId, token) {
  if (!token) {
    console.error('No API token provided');
    return [];
  }

  try {
    const url = `${API_URL}/podcast_show/${showId}`;
    console.log('Episodes Request URL:', url);

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log('Episodes API Response:', JSON.stringify(res.data));
    return res.data.items || [];
  } catch (err) {
    console.error('Episodes API error:', err.response?.data || err.message);
    return [];
  }
}
