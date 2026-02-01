const BASE_URL = 'http://localhost:3030/event';

function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Format a date string into a readable 
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getUTCFullYear();
    return `${day} ${monthName} ${year}`;
}

function formatTimeRange(startTime, endTime) {
    const to12h = (timeStr) => {
        const [hour, minute] = timeStr.split(':').map(Number);
        const suffix = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
    };
    return `${to12h(startTime)} → ${to12h(endTime)}`;
}

// Run this code after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    const eventId = getEventIdFromUrl();
    if (!eventId) {
        alert('No event ID provided.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/${eventId}`);
        const result = await response.json();

        if (result.error || !result.data) {
            throw new Error("Failed to fetch event data");
        }

        const event = result.data;

        document.querySelector('.event-img').src = event.e_img;
        document.querySelector('.event-img').alt = event.e_name;
        document.querySelector('.event-title').innerHTML = `<i class="fa-solid fa-futbol"></i> ${event.e_name}`;
        document.querySelector('.subtitle').innerHTML = `<em>Join us for this ${event.e_category} event!</em>`;
        document.querySelector('.description').textContent = event.e_details;

        const eventInfo = document.querySelectorAll('.event-info li');
        eventInfo[0].innerHTML = `<i class="fa-solid fa-location-dot"></i> ${event.e_location}`;
        eventInfo[1].innerHTML = `<i class="fa-solid fa-calendar"></i> ${formatDate(event.e_start_date)}`;

        if (event.e_start_time && event.e_end_time) {
            eventInfo[2].innerHTML = `<i class="fa-solid fa-clock"></i> ${formatTimeRange(event.e_start_time, event.e_end_time)}`;
        } else {
            eventInfo[2].style.display = "none";
        }
    } catch (error) {
        console.error("Error loading event detail:", error);
        document.querySelector('.event-container').innerHTML = "<p>Failed to load event detail.</p>";
    }
});
