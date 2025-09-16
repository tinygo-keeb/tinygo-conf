// Combined session and speaker fetch script
const SESSION_API_URL = 'https://sessionize.com/api/v2/y2g3or7x/view/Sessions';
const SPEAKER_API_URL = 'https://sessionize.com/api/v2/y2g3or7x/view/SpeakerWall';

async function fetchSessionsAndSpeakers() {
    // Fetch both sessions and speakers
    await Promise.all([
        fetchSessions(),
        fetchSpeakers()
    ]);

    // Initialize main tab functionality
    initializeMainTabs();
}

async function fetchSessions() {
    const sessionContainerJa = document.querySelector('#sessions-ja');
    const sessionContainerEn = document.querySelector('#sessions-en');

    if (!sessionContainerJa || !sessionContainerEn) return;

    try {
        const response = await fetch(SESSION_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            sessionContainerJa.innerHTML = '<p>セッション情報は近日公開予定です。</p>';
            sessionContainerEn.innerHTML = '<p>Session information will be announced soon.</p>';
        } else {
            // Create tabs for sessions
            sessionContainerJa.innerHTML = createSessionTabs(data, 'ja');
            sessionContainerEn.innerHTML = createSessionTabs(data, 'en');

            // Initialize session tab functionality
            initializeSessionTabs();
        }

    } catch (error) {
        console.error('Error fetching sessions:', error);
        sessionContainerJa.innerHTML = '<p>セッション情報の読み込みに失敗しました。</p>';
        sessionContainerEn.innerHTML = '<p>Failed to load session information.</p>';
    }
}

async function fetchSpeakers() {
    const speakerContainerJa = document.querySelector('#speakers-ja .speakers-container');
    const speakerContainerEn = document.querySelector('#speakers-en .speakers-container');

    if (!speakerContainerJa || !speakerContainerEn) return;

    try {
        const response = await fetch(SPEAKER_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const speakers = await response.json();

        if (!speakers || speakers.length === 0) {
            speakerContainerJa.innerHTML = '<p>登壇者情報は近日公開予定です。</p>';
            speakerContainerEn.innerHTML = '<p>Speaker information will be announced soon.</p>';
        } else {
            let speakersHtmlJa = '<div class="speakers-grid">';
            let speakersHtmlEn = '<div class="speakers-grid">';

            speakers.forEach(speaker => {
                const speakerCard = createSpeakerCard(speaker);
                speakersHtmlJa += speakerCard;
                speakersHtmlEn += speakerCard;
            });

            speakersHtmlJa += '</div>';
            speakersHtmlEn += '</div>';

            speakerContainerJa.innerHTML = speakersHtmlJa;
            speakerContainerEn.innerHTML = speakersHtmlEn;
        }

    } catch (error) {
        console.error('Error fetching speakers:', error);
        speakerContainerJa.innerHTML = '<p>登壇者情報の読み込みに失敗しました。</p>';
        speakerContainerEn.innerHTML = '<p>Failed to load speaker information.</p>';
    }
}

function createSessionTabs(data, lang) {
    let html = '<div class="session-tabs">';

    // Create tab buttons for session categories
    html += '<div class="tab-buttons">';
    data.forEach((group, index) => {
        const isActive = index === 0 ? 'active' : '';
        const groupName = group.groupName || `Day ${index + 1}`;
        html += `<button class="tab-button ${isActive}" data-tab="${lang}-session-${index}">${groupName}</button>`;
    });
    html += '</div>';

    // Create tab content
    html += '<div class="tab-contents">';
    data.forEach((group, index) => {
        const isActive = index === 0 ? 'active' : '';
        html += `<div class="tab-content ${isActive}" id="${lang}-session-${index}">`;

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

    if (startsAt && endsAt) {
        const timeStr = formatTime(startsAt, endsAt);
        card += '<div class="session-time">';
        card += `<span class="time">${timeStr}</span>`;
        if (room) {
            card += ` <span class="room">${room}</span>`;
        }
        card += '</div>';
    }

    card += `<h3 class="session-title">${title}</h3>`;

    if (speakers.length > 0) {
        card += '<div class="session-speakers">';
        speakers.forEach(speaker => {
            card += `<span class="speaker-name">${speaker.name}</span>`;
        });
        card += '</div>';
    }

    if (categories.length > 0) {
        card += '<div class="session-tags">';
        categories.forEach(category => {
            if (category.categoryItems && category.categoryItems.length > 0) {
                category.categoryItems.forEach(item => {
                    card += `<span class="tag">${item.name}</span>`;
                });
            }
        });
        card += '</div>';
    }

    if (description) {
        const truncated = description.length > 200
            ? description.substring(0, 200) + '...'
            : description;
        card += `<p class="session-description">${truncated}</p>`;
    }

    card += '</div>';
    return card;
}

function createSpeakerCard(speaker) {
    const name = speaker.fullName || 'Unknown Speaker';
    const tagline = speaker.tagLine || '';
    const bio = speaker.bio || '';
    const profilePic = speaker.profilePicture || '';

    const twitter = speaker.links?.find(link => link.linkType === 'Twitter')?.url || '';
    const github = speaker.links?.find(link => link.linkType === 'GitHub')?.url || '';
    const website = speaker.links?.find(link => link.linkType === 'Website')?.url || '';
    const linkedin = speaker.links?.find(link => link.linkType === 'LinkedIn')?.url || '';

    const sessions = speaker.sessions || [];
    const sessionTitles = sessions.map(s => s.name).join(', ');

    let card = '<div class="speaker-card">';

    if (profilePic) {
        card += `<img src="${profilePic}" alt="${name}" class="speaker-photo" loading="lazy">`;
    } else {
        card += '<div class="speaker-photo-placeholder"></div>';
    }

    card += '<div class="speaker-info">';
    card += `<h3 class="speaker-name">${name}</h3>`;

    if (tagline) {
        card += `<p class="speaker-tagline">${tagline}</p>`;
    }

    if (sessionTitles) {
        card += `<p class="speaker-sessions"><strong>Session:</strong> ${sessionTitles}</p>`;
    }

    if (twitter || github || website || linkedin) {
        card += '<div class="speaker-links">';

        if (twitter) {
            card += `<a href="${twitter}" target="_blank" rel="noopener noreferrer" class="social-link" title="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            </a>`;
        }

        if (github) {
            card += `<a href="${github}" target="_blank" rel="noopener noreferrer" class="social-link" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>`;
        }

        if (website) {
            card += `<a href="${website}" target="_blank" rel="noopener noreferrer" class="social-link" title="Website">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
            </a>`;
        }

        if (linkedin) {
            card += `<a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </a>`;
        }

        card += '</div>';
    }

    card += '</div></div>';

    return card;
}

function formatTime(startsAt, endsAt) {
    const startHours = startsAt.getHours().toString().padStart(2, '0');
    const startMinutes = startsAt.getMinutes().toString().padStart(2, '0');
    const endHours = endsAt.getHours().toString().padStart(2, '0');
    const endMinutes = endsAt.getMinutes().toString().padStart(2, '0');

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

function initializeMainTabs() {
    const mainTabButtons = document.querySelectorAll('.main-tab-button');

    mainTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-main-tab');
            const tabContainer = this.closest('.main-tabs');

            if (!tabContainer) return;

            // Remove active class from all buttons in this container
            tabContainer.querySelectorAll('.main-tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Remove active class from all contents in this container
            tabContainer.querySelectorAll('.main-tab-content').forEach(content => {
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

function initializeSessionTabs() {
    const tabButtons = document.querySelectorAll('.session-tabs .tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.session-tabs');

            if (!tabContainer) return;

            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            this.classList.add('active');

            const targetContent = tabContainer.querySelector(`#${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Fetch data when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchSessionsAndSpeakers);
} else {
    fetchSessionsAndSpeakers();
}