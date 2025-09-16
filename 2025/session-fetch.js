// Sessionize session fetch script
const SESSION_API_URL = 'https://sessionize.com/api/v2/y2g3or7x/view/Sessions';

async function fetchSessions() {
    const sessionSectionJa = document.querySelector('#session .lang-ja');
    const sessionSectionEn = document.querySelector('#session .lang-en');

    if (!sessionSectionJa || !sessionSectionEn) return;

    // Update section headers
    sessionSectionJa.innerHTML = '<h2>セッション情報</h2><p>セッション情報を読み込み中...</p>';
    sessionSectionEn.innerHTML = '<h2>Session Information</h2><p>Loading sessions...</p>';

    try {
        // Fetch sessions from Sessionize API
        const response = await fetch(SESSION_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Build tabbed interface
        let sessionHtmlJa = '<h2>セッション情報</h2>';
        let sessionHtmlEn = '<h2>Session Information</h2>';

        if (!data || data.length === 0) {
            sessionHtmlJa += '<p>セッション情報は近日公開予定です。</p>';
            sessionHtmlEn += '<p>Session information will be announced soon.</p>';
        } else {
            // Create tabs for Japanese section
            sessionHtmlJa += createSessionTabs(data, 'ja');

            // Create tabs for English section
            sessionHtmlEn += createSessionTabs(data, 'en');
        }

        // Update the HTML
        sessionSectionJa.innerHTML = sessionHtmlJa;
        sessionSectionEn.innerHTML = sessionHtmlEn;

        // Initialize tab functionality
        initializeTabs();

    } catch (error) {
        console.error('Error fetching sessions:', error);

        // Show error message
        sessionSectionJa.innerHTML = '<h2>セッション情報</h2><p>セッション情報の読み込みに失敗しました。後ほど再度お試しください。</p>';
        sessionSectionEn.innerHTML = '<h2>Session Information</h2><p>Failed to load session information. Please try again later.</p>';
    }
}

function createSessionTabs(data, lang) {
    let html = '<div class="session-tabs">';

    // Create tab buttons
    html += '<div class="tab-buttons">';
    data.forEach((group, index) => {
        const isActive = index === 0 ? 'active' : '';
        const groupName = group.groupName || `Day ${index + 1}`;
        html += `<button class="tab-button ${isActive}" data-tab="${lang}-${index}">${groupName}</button>`;
    });
    html += '</div>';

    // Create tab content
    html += '<div class="tab-contents">';
    data.forEach((group, index) => {
        const isActive = index === 0 ? 'active' : '';
        html += `<div class="tab-content ${isActive}" id="${lang}-${index}">`;

        if (group.sessions && group.sessions.length > 0) {
            html += '<div class="sessions-list">';

            group.sessions.forEach(session => {
                html += createSessionCard(session, lang);
            });

            html += '</div>';
        } else {
            html += lang === 'ja'
                ? '<p>このカテゴリーにはまだセッションがありません。</p>'
                : '<p>No sessions in this category yet.</p>';
        }

        html += '</div>';
    });
    html += '</div>';

    html += '</div>';
    return html;
}

function createSessionCard(session, lang) {
    const title = session.title || (lang === 'ja' ? '未定' : 'TBD');
    const description = session.description || '';
    const speakers = session.speakers || [];
    const categories = session.categories || [];
    const startsAt = session.startsAt ? new Date(session.startsAt) : null;
    const endsAt = session.endsAt ? new Date(session.endsAt) : null;
    const room = session.room || '';

    let card = '<div class="session-card">';

    // Time and room
    if (startsAt && endsAt) {
        const timeStr = formatTime(startsAt, endsAt);
        card += '<div class="session-time">';
        card += `<span class="time">${timeStr}</span>`;
        if (room) {
            card += ` <span class="room">${room}</span>`;
        }
        card += '</div>';
    }

    // Title
    card += `<h3 class="session-title">${title}</h3>`;

    // Speakers
    if (speakers.length > 0) {
        card += '<div class="session-speakers">';
        speakers.forEach(speaker => {
            card += `<span class="speaker-name">${speaker.name}</span>`;
        });
        card += '</div>';
    }

    // Categories/Tags
    if (categories.length > 0) {
        card += '<div class="session-tags">';
        categories.forEach(category => {
            // Extract category items (tags)
            if (category.categoryItems && category.categoryItems.length > 0) {
                category.categoryItems.forEach(item => {
                    card += `<span class="tag">${item.name}</span>`;
                });
            }
        });
        card += '</div>';
    }

    // Description (truncated)
    if (description) {
        const truncated = description.length > 200
            ? description.substring(0, 200) + '...'
            : description;
        card += `<p class="session-description">${truncated}</p>`;
    }

    card += '</div>';
    return card;
}

function formatTime(startsAt, endsAt) {
    const startHours = startsAt.getHours().toString().padStart(2, '0');
    const startMinutes = startsAt.getMinutes().toString().padStart(2, '0');
    const endHours = endsAt.getHours().toString().padStart(2, '0');
    const endMinutes = endsAt.getMinutes().toString().padStart(2, '0');

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

function initializeTabs() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.session-tabs');

            if (!tabContainer) return;

            // Remove active class from all buttons in this container
            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Remove active class from all contents in this container
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            // Add active class to corresponding content
            const targetContent = tabContainer.querySelector(`#${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Fetch sessions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchSessions);
} else {
    // DOM is already loaded
    fetchSessions();
}