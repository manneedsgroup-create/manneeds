// Vercel Serverless Function: Auto-fetches latest Reels from your Instagram page
// Supports either official Instagram Graph API (INSTAGRAM_ACCESS_TOKEN)
// or a free Behold.so Instagram JSON feed URL (BEHOLD_FEED_URL) in Vercel Env Vars.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const beholdUrl = process.env.BEHOLD_FEED_URL || 'https://feeds.behold.so/2OBN1aB0Fb3QMdLs2bGG';

  try {
    if (igToken) {
      const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${encodeURIComponent(igToken)}`;
      const response = await fetch(apiUrl);
      const json = await response.json();

      if (!response.ok || json.error) {
        return res.status(200).json({ reels: [], configured: true, error: json.error?.message || 'Instagram API error' });
      }

      const items = Array.isArray(json.data) ? json.data : [];
      const reels = items
        .filter((item) => item.media_type === 'VIDEO' || item.media_product_type === 'REELS')
        .slice(0, 8)
        .map((item) => ({
          id: item.id,
          title: (item.caption || 'ManNeeds Pure Harvest').split('\n')[0].slice(0, 72),
          platform: 'instagram',
          reel_url: item.permalink,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url,
          created_at: item.timestamp
        }));

      return res.status(200).json({ reels, configured: true, source: 'instagram_graph' });
    }

    if (beholdUrl) {
      const response = await fetch(beholdUrl);
      const json = await response.json();
      const posts = Array.isArray(json?.posts) ? json.posts : Array.isArray(json) ? json : [];
      const videoPosts = posts.filter((p) => p.mediaType === 'VIDEO' || p.isReel || p.permalink?.includes('/reel/'));
      const chosen = videoPosts.length > 0 ? videoPosts : posts;
      const reels = chosen
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          title: (p.caption || 'ManNeeds Pure Harvest').split('\n')[0].slice(0, 72),
          platform: 'instagram',
          media_type: p.mediaType === 'VIDEO' || p.isReel || p.permalink?.includes('/reel/') ? 'VIDEO' : 'IMAGE',
          reel_url: p.permalink,
          media_url: p.mediaUrl || p.sizes?.large?.mediaUrl || p.sizes?.medium?.mediaUrl || '',
          thumbnail_url: p.thumbnailUrl || p.sizes?.medium?.mediaUrl || '',
          created_at: p.timestamp
        }));

      return res.status(200).json({ reels, configured: true, source: 'behold' });
    }

    return res.status(200).json({ reels: [], configured: false });
  } catch (err) {
    return res.status(200).json({ reels: [], configured: false, error: err?.message || 'Fetch error' });
  }
}
