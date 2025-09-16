// WordPress blog fetch script - Using CORS proxy
const RSS_FEED_URL = 'https://tinygo-keeb.org/blog/?feed=rss2';
const CORS_PROXY = 'https://corsproxy.io/?';

async function fetchBlogPosts() {
    const blogSectionJa = document.querySelector('#participation .lang-ja');
    const blogSectionEn = document.querySelector('#participation .lang-en');

    if (!blogSectionJa || !blogSectionEn) return;

    // Add loading state
    const loadingHtml = '<p>ブログ記事を読み込み中...</p>';
    const loadingHtmlEn = '<p>Loading blog posts...</p>';

    blogSectionJa.innerHTML = '<h2>ブログ</h2>' + loadingHtml;
    blogSectionEn.innerHTML = '<h2>Blog</h2>' + loadingHtmlEn;

    try {
        // Fetch RSS feed via CORS proxy
        const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_FEED_URL));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for parse errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('RSS feed parsing error');
        }

        // Extract items from RSS feed
        const items = xmlDoc.querySelectorAll('item');

        // Build HTML for sections
        let blogHtmlJa = '<h2>ブログ</h2>';
        let blogHtmlEn = '<h2>Blog</h2>';

        if (items.length === 0) {
            blogHtmlJa += '<p>ブログ記事がありません。</p>';
            blogHtmlEn += '<p>No blog posts available.</p>';
        } else {
            // Process up to 10 items
            const maxItems = Math.min(items.length, 10);
            for (let i = 0; i < maxItems; i++) {
                const item = items[i];
                const title = item.querySelector('title')?.textContent || 'Untitled';
                const link = item.querySelector('link')?.textContent || '#';
                const pubDate = item.querySelector('pubDate')?.textContent || '';

                // Format date
                let formattedDate = '';
                if (pubDate) {
                    const date = new Date(pubDate);
                    formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                }

                // Japanese section
                blogHtmlJa += `${formattedDate} - <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a><br>\n`;

                // English section
                const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(title);
                blogHtmlEn += `${formattedDate} - <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>${isJapanese ? ' (japanese)' : ''}<br>\n`;
            }
        }

        // Add link to all posts
        blogHtmlJa += '<p style="margin-top: 15px;"><a href="https://tinygo-keeb.org/blog/" target="_blank" rel="noopener noreferrer">すべてのブログ記事を見る →</a></p>';
        blogHtmlEn += '<p style="margin-top: 15px;"><a href="https://tinygo-keeb.org/blog/" target="_blank" rel="noopener noreferrer">View all blog posts →</a></p>';

        // Update the HTML
        blogSectionJa.innerHTML = blogHtmlJa;
        blogSectionEn.innerHTML = blogHtmlEn;

    } catch (error) {
        console.error('Error fetching blog posts:', error);

        // Show error message with link to blog
        blogSectionJa.innerHTML = '<h2>ブログ</h2><p>ブログ記事の読み込みに失敗しました。<a href="https://tinygo-keeb.org/blog/" target="_blank" rel="noopener noreferrer">ブログサイトで直接ご覧ください。</a></p>';
        blogSectionEn.innerHTML = '<h2>Blog</h2><p>Failed to load blog posts. <a href="https://tinygo-keeb.org/blog/" target="_blank" rel="noopener noreferrer">Please visit the blog site directly.</a></p>';
    }
}

// Fetch blog posts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchBlogPosts);
} else {
    // DOM is already loaded
    fetchBlogPosts();
}