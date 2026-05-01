"use strict";
let map = null;
let markers = [];
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initMap();
    initSearch();
    initBookingModal();
});
/* ---------- Auth ---------- */
function initAuth() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                showMessage('Logged in successfully.', 'success');
                updateAuthUI(data.username);
                document.getElementById('login-form').reset();
            }
            else {
                showMessage(data.error || 'Login failed.', 'error');
            }
        }
        catch (err) {
            showMessage('Network error during login.', 'error');
        }
    });
    logoutBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/user/logout', { method: 'POST', credentials: 'include' });
            if (res.ok) {
                showMessage('Logged out successfully.', 'success');
                updateAuthUI(null);
            }
        }
        catch (err) {
            showMessage('Network error during logout.', 'error');
        }
    });
    checkSession();
}
async function checkSession() {
    try {
        const res = await fetch('/api/user/session', { credentials: 'include' });
        const data = await res.json();
        if (data.loggedIn) {
            updateAuthUI(data.username);
        }
        else {
            updateAuthUI(null);
        }
    }
    catch (err) {
        updateAuthUI(null);
    }
}
function updateAuthUI(username) {
    const loginContainer = document.getElementById('login-form-container');
    const userInfo = document.getElementById('user-info');
    const message = document.getElementById('logged-in-message');
    if (username) {
        loginContainer.classList.add('hidden');
        userInfo.classList.remove('hidden');
        message.textContent = `Logged in as ${username}`;
    }
    else {
        loginContainer.classList.remove('hidden');
        userInfo.classList.add('hidden');
        message.textContent = '';
    }
}
/* ---------- Map ---------- */
function initMap() {
    map = L.map('map').setView([54.5, -3.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('popupopen', () => {
        document.querySelectorAll('.popup-book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const id = parseInt(target.dataset.id, 10);
                const name = target.dataset.name;
                openBookingModal(id, name);
            });
        });
    });
}
/* ---------- Search & Map ---------- */
function initSearch() {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const location = document.getElementById('location-input').value;
        const type = document.getElementById('type-input').value;
        try {
            let url = `/api/accommodation/location?location=${encodeURIComponent(location)}`;
            if (type) {
                url = `/api/accommodation/type-location?location=${encodeURIComponent(location)}&type=${encodeURIComponent(type)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (!res.ok) {
                showMessage('Error fetching results.', 'error');
                return;
            }
            displayResults(data);
        }
        catch (err) {
            showMessage('Network error during search.', 'error');
        }
    });
}
function displayResults(accommodations) {
    const resultsList = document.getElementById('results-list');
    if (accommodations.length === 0) {
        resultsList.innerHTML = '<p>No accommodation found for that location.</p>';
        clearMarkers();
        return;
    }
    resultsList.innerHTML = '';
    clearMarkers();
    const group = L.featureGroup();
    accommodations.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'acc-card';
        card.innerHTML = `
      <h4>${escapeHtml(acc.name)}</h4>
      <p>Type: ${escapeHtml(acc.type)}</p>
      <p>Location: ${escapeHtml(acc.location)}</p>
      <button class="book-btn" data-id="${acc.ID}" data-name="${escapeHtml(acc.name)}">Book</button>
    `;
        resultsList.appendChild(card);
        const marker = L.marker([acc.latitude, acc.longitude])
            .bindPopup(`
        <b>${escapeHtml(acc.name)}</b><br>
        Type: ${escapeHtml(acc.type)}<br>
        Location: ${escapeHtml(acc.location)}<br>
        <button class="popup-book-btn" data-id="${acc.ID}" data-name="${escapeHtml(acc.name)}">Book</button>
      `);
        marker.addTo(map);
        markers.push(marker);
        group.addLayer(marker);
        card.querySelector('.book-btn').addEventListener('click', () => {
            openBookingModal(acc.ID, acc.name);
        });
    });
    map.fitBounds(group.getBounds().pad(0.1));
}
function clearMarkers() {
    if (map) {
        markers.forEach(m => map.removeLayer(m));
    }
    markers = [];
}
/* ---------- Booking Modal ---------- */
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('booking-form');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const accID = document.getElementById('booking-acc-id').value;
        const dateInput = document.getElementById('booking-date').value;
        const npeople = document.getElementById('booking-people').value;
        if (!dateInput) {
            const msgDiv = document.getElementById('booking-message');
            msgDiv.textContent = 'Please select a date.';
            msgDiv.className = 'error';
            return;
        }
        const parts = dateInput.split('-');
        const thedate = parseInt(parts[0].slice(2) + parts[1] + parts[2], 10);
        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ accID, thedate, npeople, apiID: '0x574144' })
            });
            const data = await res.json();
            const msgDiv = document.getElementById('booking-message');
            if (res.ok) {
                msgDiv.textContent = 'Booking successful!';
                msgDiv.className = 'success';
                setTimeout(() => modal.classList.add('hidden'), 1500);
            }
            else {
                let userMsg = 'Booking failed. ';
                if (res.status === 400) {
                    userMsg += data.error || 'Please check your input and try again.';
                }
                else if (res.status === 401) {
                    userMsg += 'You must be logged in to make a booking.';
                }
                else if (res.status === 403) {
                    userMsg += 'Invalid API key.';
                }
                else if (res.status === 409) {
                    userMsg += data.error || 'There is not enough space available for your party.';
                }
                else {
                    userMsg += data.error || 'An unexpected error occurred. Please try again later.';
                }
                msgDiv.textContent = userMsg;
                msgDiv.className = 'error';
            }
        }
        catch (err) {
            const msgDiv = document.getElementById('booking-message');
            msgDiv.textContent = 'Network error during booking. Please check your connection.';
            msgDiv.className = 'error';
        }
    });
}
function openBookingModal(accID, accName) {
    const modal = document.getElementById('booking-modal');
    document.getElementById('booking-acc-id').value = accID.toString();
    document.getElementById('booking-acc-name').textContent = accName;
    document.getElementById('booking-message').textContent = '';
    document.getElementById('booking-form').reset();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const dateInput = document.getElementById('booking-date');
    dateInput.min = todayStr;
    dateInput.value = '2026-06-30';
    modal.classList.remove('hidden');
}
/* ---------- Utilities ---------- */
function showMessage(text, type) {
    const area = document.getElementById('message-area');
    area.textContent = text;
    area.className = type;
    setTimeout(() => {
        area.textContent = '';
        area.className = '';
    }, 5000);
}
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
