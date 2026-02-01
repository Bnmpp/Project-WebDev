const API_URL = 'http://localhost:3030/events';

let allEvents = [];
const eventContainer = document.querySelector(".e2");
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const locationSelect = document.getElementById('locationSelect');

// Load events when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch event data from the server
        const response = await fetch(API_URL);
        const result = await response.json();
        // Handle error or empty response
        if (result.error || !result.data) {
            throw new Error("Failed to fetch events");
        }
        // Store events and render them
        allEvents = result.data;
        renderEvents(allEvents);
    } catch (error) {
        // Display error message if fetch fails
        console.error("Error fetching events:", error);
        eventContainer.innerHTML = "<p>Failed to load events. Please try again later.</p>";
    }
});

// Render event cards in the container
function renderEvents(events) {
    eventContainer.innerHTML = "";
    // Show message if no events found
    if (events.length === 0) {
        eventContainer.innerHTML = "<p>No events found.</p>";
        return;
    }
    // Loop through each event and create HTML block
    events.forEach(event => {
        const eventHTML = `
            <div class="block">
                <img src="${event.e_img}" alt="${event.e_name}">
                <div class="content2">
                    <h3>${event.e_name}</h3>
                    <div class="e-info">
                        <i class="fa-solid fa-location-dot"></i>
                        <span> ${event.e_location}</span>
                        <i class="fa-solid fa-calendar-days"></i>
                        <span>${formatDate(event.e_start_date)}</span>
                    </div>
                    <a href="/detail?id=${event.event_id}">
                        <button class="details-btn"><span>See Details</span></button>
                    </a>
                </div>
            </div>`;
        eventContainer.innerHTML += eventHTML;
    });
}

// Format date string as DD/MM/YYYY
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

// Filter events based on search, category, and location
function filterEvents() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value.toLowerCase();
    const selectedLocation = locationSelect.value.toLowerCase();

    const filtered = allEvents.filter(event => {
        const nameMatch = event.e_name.toLowerCase().includes(searchText);
        const categoryMatch = selectedCategory === "all" || event.e_category.toLowerCase() === selectedCategory;
        const locationMatch = selectedLocation === "all" || event.e_location.toLowerCase().includes(selectedLocation);

        return nameMatch && categoryMatch && locationMatch;
    });

    renderEvents(filtered);
}

// Add event listeners to filter inputs
searchInput.addEventListener('input', filterEvents);
categorySelect.addEventListener('change', filterEvents);
locationSelect.addEventListener('change', filterEvents);
