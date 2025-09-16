// Sessionize speaker fetch script
const SPEAKER_API_URL = 'https://sessionize.com/api/v2/y2g3or7x/view/SpeakerWall';

async function fetchSpeakers() {
    const speakerSectionJa = document.querySelector('#speakers .lang-ja .speakers-container');
    const speakerSectionEn = document.querySelector('#speakers .lang-en .speakers-container');

    if (!speakerSectionJa || !speakerSectionEn) return;

    // Add loading state
    speakerSectionJa.innerHTML = '<p>登壇者情報を読み込み中...</p>';
    speakerSectionEn.innerHTML = '<p>Loading speakers...</p>';

    try {
        // Fetch speakers from Sessionize API
        const response = await fetch(SPEAKER_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const speakers = await response.json();

        // Build HTML for speakers
        let speakersHtmlJa = '';
        let speakersHtmlEn = '';

        if (!speakers || speakers.length === 0) {
            speakersHtmlJa = '<p>登壇者情報は近日公開予定です。</p>';
            speakersHtmlEn = '<p>Speaker information will be announced soon.</p>';
        } else {
            speakersHtmlJa = '<div class="speakers-grid">';
            speakersHtmlEn = '<div class="speakers-grid">';

            speakers.forEach(speaker => {
                const speakerCard = createSpeakerCard(speaker);
                speakersHtmlJa += speakerCard;
                speakersHtmlEn += speakerCard;
            });

            speakersHtmlJa += '</div>';
            speakersHtmlEn += '</div>';
        }

        // Update the HTML
        speakerSectionJa.innerHTML = speakersHtmlJa;
        speakerSectionEn.innerHTML = speakersHtmlEn;

    } catch (error) {
        console.error('Error fetching speakers:', error);

        // Show error message
        speakerSectionJa.innerHTML = '<p>登壇者情報の読み込みに失敗しました。後ほど再度お試しください。</p>';
        speakerSectionEn.innerHTML = '<p>Failed to load speaker information. Please try again later.</p>';
    }
}

function createSpeakerCard(speaker) {
    const name = speaker.fullName || 'Unknown Speaker';
    const tagline = speaker.tagLine || '';
    const bio = speaker.bio || '';
    const profilePic = speaker.profilePicture || '';

    // Social links
    const twitter = speaker.links?.find(link => link.linkType === 'Twitter')?.url || '';
    const github = speaker.links?.find(link => link.linkType === 'GitHub')?.url || '';
    const website = speaker.links?.find(link => link.linkType === 'Website')?.url || '';
    const linkedin = speaker.links?.find(link => link.linkType === 'LinkedIn')?.url || '';

    // Sessions
    const sessions = speaker.sessions || [];
    const sessionTitles = sessions.map(s => s.name).join(', ');

    let card = '<div class="speaker-card">';

    // Profile picture
    if (profilePic) {
        card += `<img src="${profilePic}" alt="${name}" class="speaker-photo" loading="lazy">`;
    } else {
        card += '<div class="speaker-photo-placeholder"></div>';
    }

    // Speaker info
    card += '<div class="speaker-info">';
    card += `<h3 class="speaker-name">${name}</h3>`;

    if (tagline) {
        card += `<p class="speaker-tagline">${tagline}</p>`;
    }

    if (sessionTitles) {
        card += `<p class="speaker-sessions"><strong>Session:</strong> ${sessionTitles}</p>`;
    }

    // Social links
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

// Fetch speakers when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchSpeakers);
} else {
    // DOM is already loaded
    fetchSpeakers();
}