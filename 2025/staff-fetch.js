// Staff information fetch script
const STAFF_JSON_URL = 'staff.json';

async function fetchStaff() {
    try {
        const response = await fetch(STAFF_JSON_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderStaff(data.staff);

    } catch (error) {
        console.error('Error fetching staff information:', error);
        showStaffError();
    }
}

function renderStaff(staffList) {
    const staffSectionJa = document.querySelector('#staff .lang-ja');
    const staffSectionEn = document.querySelector('#staff .lang-en');

    if (!staffSectionJa || !staffSectionEn) return;

    // Build Japanese section
    let staffHtmlJa = `
        <h2>スタッフ</h2>
        <p>TinyGo Conference 2025 の運営スタッフです。</p>
        <div class="staff-grid">
    `;

    staffList.forEach(staff => {
        const avatarImg = staff.avatar
            ? `<img src="${staff.avatar}" alt="${staff.name}" class="staff-photo">`
            : `<div class="staff-photo-placeholder"></div>`;

        let linksHtml = '';
        if (staff.links) {
            linksHtml = '<div class="staff-links">';

            if (staff.links.twitter) {
                linksHtml += `
                    <a href="${staff.links.twitter}" target="_blank" rel="noopener noreferrer" class="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                `;
            }

            if (staff.links.github) {
                linksHtml += `
                    <a href="${staff.links.github}" target="_blank" rel="noopener noreferrer" class="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                `;
            }

            linksHtml += '</div>';
        }

        staffHtmlJa += `
            <div class="staff-card">
                ${avatarImg}
                <h3 class="staff-name">${staff.name}</h3>
                <p class="staff-role">${staff.role}</p>
                ${linksHtml}
            </div>
        `;
    });

    staffHtmlJa += `
        </div>
    `;

    // Build English section
    let staffHtmlEn = `
        <h2>Staff</h2>
        <p>The organizing staff of TinyGo Conference 2025.</p>
        <div class="staff-grid">
    `;

    staffList.forEach(staff => {
        const avatarImg = staff.avatar
            ? `<img src="${staff.avatar}" alt="${staff.name_en || staff.name}" class="staff-photo">`
            : `<div class="staff-photo-placeholder"></div>`;

        let linksHtml = '';
        if (staff.links) {
            linksHtml = '<div class="staff-links">';

            if (staff.links.twitter) {
                linksHtml += `
                    <a href="${staff.links.twitter}" target="_blank" rel="noopener noreferrer" class="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                `;
            }

            if (staff.links.github) {
                linksHtml += `
                    <a href="${staff.links.github}" target="_blank" rel="noopener noreferrer" class="social-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                `;
            }

            linksHtml += '</div>';
        }

        staffHtmlEn += `
            <div class="staff-card">
                ${avatarImg}
                <h3 class="staff-name">${staff.name_en || staff.name}</h3>
                <p class="staff-role">${staff.role_en || staff.role}</p>
                ${linksHtml}
            </div>
        `;
    });

    staffHtmlEn += `
        </div>
    `;

    // Update the HTML
    staffSectionJa.innerHTML = staffHtmlJa;
    staffSectionEn.innerHTML = staffHtmlEn;
}

function showStaffError() {
    const staffSectionJa = document.querySelector('#staff .lang-ja');
    const staffSectionEn = document.querySelector('#staff .lang-en');

    if (staffSectionJa) {
        staffSectionJa.innerHTML = '<h2>スタッフ</h2><p>スタッフ情報の読み込みに失敗しました。</p>';
    }
    if (staffSectionEn) {
        staffSectionEn.innerHTML = '<h2>Staff</h2><p>Failed to load staff information.</p>';
    }
}

// Fetch staff when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchStaff);
} else {
    fetchStaff();
}
