const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    setupModalEvents();
});

function showSuccessMessage(message) {
    return swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
    });
}

function showErrorMessage(message) {
    return swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
}

// Fetch all events from the API and render them in a table
function fetchEvents() {
    axios.get(`${API_URL}/events`)
        .then(response => {
            const data = response.data.data;
            renderEventTable(data);
        })
        .catch(error => console.error('Error fetching events:', error));
}

// Render events data into the HTML table
function renderEventTable(data) {
    const eventTable = document.querySelector('#eventTable');
    eventTable.innerHTML = '';

    data.forEach(event => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${event.event_id}</td>
            <td><img src="${event.e_img}" alt="Event Image" style="max-width: 100px;"></td>
            <td>${event.e_name}</td>
            <td>${formatDate(event.e_start_date)}</td>
            <td>${formatDate(event.e_end_date)}</td>
            <td>${event.e_category}</td>
            <td>${event.e_status}</td>
            <td>${event.e_location}</td>
            <td>${event.e_details}</td>
            <td>${event.participant ?? 0}</td>
            <td class="container-btn">
                <button class="edit-btn" onclick="openEditEvent(${event.event_id})">Edit</button>
                <button class="delete-btn" onclick="deleteEvent(${event.event_id})">Delete</button>
            </td>
        `;

        eventTable.appendChild(row);
    });
}

// Setup event listeners for opening/closing modals and saving event data
function setupModalEvents() {
    const openAddEventModalBtn = document.getElementById('openAddEventModal');
    const closeAddEventModalBtn = document.getElementById('closeAddEventModal');
    const saveEventBtn = document.getElementById('addEventBtn');
    const addEventModal = document.getElementById('addEventModal');
    const modalTitle = document.querySelector('#addEventModal h4');

    if (openAddEventModalBtn) {
        openAddEventModalBtn.addEventListener('click', () => {
            clearForm();
            modalTitle.textContent = 'Add Event';
            saveEventBtn.textContent = 'Add';
            addEventModal.style.display = 'flex';
            addEventModal.setAttribute('data-mode', 'add');
            addEventModal.removeAttribute('data-event-id');
        });
    }

    if (closeAddEventModalBtn) {
        closeAddEventModalBtn.addEventListener('click', () => {
            addEventModal.style.display = 'none';
        });
    }

    if (saveEventBtn) {
        saveEventBtn.addEventListener('click', saveEvent);
    }
}

function clearForm() {
    document.getElementById('eventName').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventCategory').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('eventDetails').value = '';
    document.getElementById('eventImageUpload').value = '';
}

// Handle form submission for both creating and updating events
function saveEvent() {
    const addEventModal = document.getElementById('addEventModal');
    const mode = addEventModal.getAttribute('data-mode');
    const eventId = addEventModal.getAttribute('data-event-id');

    const formData = new FormData();
    if (eventId) {
        formData.append('event_id', eventId);
    }
    formData.append('e_name', document.getElementById('eventName').value.trim());
    formData.append('e_location', document.getElementById('eventLocation').value);
    formData.append('e_category', document.getElementById('eventCategory').value);
    formData.append('e_start_date', document.getElementById('startDate').value);
    formData.append('e_end_date', document.getElementById('endDate').value);
    formData.append('e_details', document.getElementById('eventDetails').value.trim());
    formData.append('e_status', 'Available');
    formData.append('participant', 0);
    formData.append('currency', 'THB');

    const eventImage = document.getElementById('eventImageUpload').files[0];
    if (eventImage) {
        formData.append('e_img', eventImage);
    }

    if (!validateForm()) return;

    if (mode === 'edit') {
        axios.put(`${API_URL}/event`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                showSuccessMessage('Event updated successfully!').then(() => {
                    closeModal();
                    fetchEvents();
                });
            })
            .catch(error => {
                console.error('Error updating event:', error);
                showErrorMessage(error.response?.data?.message || 'Failed to update event');
            });
    } else {
        axios.post(`${API_URL}/event`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                showSuccessMessage('Event created successfully!').then(() => {
                    closeModal();
                    fetchEvents();
                });
            })
            .catch(error => {
                console.error('Error creating event:', error);
                showErrorMessage(error.response?.data?.message || 'Failed to create event');
            });
    }
}

// Ensure all required form fields are filled
function validateForm() {
    const requiredFields = ['eventName', 'eventLocation', 'eventCategory', 'startDate', 'endDate', 'eventDetails'];
    for (const id of requiredFields) {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            swal.fire('Warning', 'Please fill in all required fields', 'warning');
            return false;
        }
    }
    return true;
}

function closeModal() {
    document.getElementById('addEventModal').style.display = 'none';
}

// Load selected event's data and populate the form for editing
function openEditEvent(eventId) {
    const addEventModal = document.getElementById('addEventModal');
    const saveEventBtn = document.getElementById('addEventBtn');
    const modalTitle = document.querySelector('#addEventModal h4');

    axios.get(`${API_URL}/event/${eventId}`)
        .then(response => {
            const event = response.data.data;

            document.getElementById('eventName').value = event.e_name || '';
            document.getElementById('eventLocation').value = event.e_location || '';
            document.getElementById('eventCategory').value = event.e_category || '';
            document.getElementById('startDate').value = event.e_start_date || '';
            document.getElementById('endDate').value = event.e_end_date || '';
            document.getElementById('eventDetails').value = event.e_details || '';
            document.getElementById('eventImageUpload').value = '';

            addEventModal.style.display = 'flex';
            addEventModal.setAttribute('data-mode', 'edit');
            addEventModal.setAttribute('data-event-id', eventId);

            modalTitle.textContent = 'Edit Event';
            saveEventBtn.textContent = 'Save Changes';
        })
        .catch(error => {
            console.error('Error loading event detail:', error);
            showErrorMessage('Failed to load event details.');
        });
}

// Confirm and delete the selected event
function deleteEvent(eventId) {
    swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the event.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(result => {
        if (result.isConfirmed) {
            axios.delete(`${API_URL}/event/${eventId}`)
                .then(() => {
                    swal.fire('Deleted!', 'Event has been deleted.', 'success');
                    fetchEvents();
                })
                .catch(error => {
                    console.error('Error deleting event:', error);
                    showErrorMessage('Failed to delete event.');
                });
        }
    });
}
