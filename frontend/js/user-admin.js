const API_URL = 'http://localhost:3030';
document.addEventListener('DOMContentLoaded', () => {
    fetchAdmins();
    setupModalEvents();
    SearchForm();
});

// Fetch admin list from server and render in table
function fetchAdmins(filters = {}) {
    axios.get(`${API_URL}/admins`)
        .then(response => {
            const data = response.data.data;
            const filteredData = applyFilters(data, filters);
            renderAdminTable(filteredData);
        })
        .catch(error => console.error('Error fetching admins:', error));
}

// Filter admin data based on search text
function applyFilters(data, filters) {
    return data.filter(admin => {
        let isMatch = true;

        if (filters.searchText) {
            const lowerSearchText = filters.searchText.toLowerCase();
            isMatch = isMatch && (
                admin.admin_id.toString().includes(lowerSearchText) ||
                admin.a_fname.toLowerCase().includes(lowerSearchText) ||
                admin.a_lname.toLowerCase().includes(lowerSearchText) ||
                admin.a_birthdate.toLowerCase().includes(lowerSearchText) ||
                admin.a_email.toLowerCase().includes(lowerSearchText) ||
                admin.a_pass.toLowerCase().includes(lowerSearchText)
            );
        }

        return isMatch;
    });
}

// Render the admin data into the HTML table
function renderAdminTable(data) {
    const adminTable = document.querySelector('#adminTable');
    adminTable.innerHTML = '';

    data.forEach((admin) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${admin.admin_id}</td>
            <td>${admin.a_fname}</td>
            <td>${admin.a_lname}</td>
            <td>${formatDate(admin.a_birthdate)}</td>
            <td>${admin.a_email}</td>
            <td class="container-btn">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        adminTable.appendChild(row);
        const editButton = row.querySelector('.edit-btn');
        const deleteButton = row.querySelector('.delete-btn');

        editButton.addEventListener('click', () => editAdmin(admin.admin_id));
        deleteButton.addEventListener('click', () => deleteAdmin(admin.admin_id));
    });
}

// Handle the search form click event
function SearchForm() {
    const searchForm = document.querySelector('.btn-search');
    searchForm.addEventListener('click', (event) => {
        event.preventDefault();

        const searchText = document.querySelector('.input-search').value;

        const filters = {
            searchText: searchText || ''
        };

        fetchAdmins(filters);
    });
}

// Load specific admin data into modal form for editing
function editAdmin(adminId) {
    axios.get(`${API_URL}/admin/${adminId}`)
        .then(response => {
            const admin = response.data.data;
            document.getElementById('admin_id').value = admin.admin_id;
            document.getElementById('a_fname').value = admin.a_fname;
            document.getElementById('a_lname').value = admin.a_lname;
            document.getElementById('a_birthdate').value = formatDate(admin.a_birthdate);
            document.getElementById('a_email').value = admin.a_email;
            openEditModal();
        })
        .catch(error => console.error('Error fetching admin data:', error));
}

// Save edited admin data
function saveChanges() {
    const updatedAdmin = {
        admin_id: document.getElementById('admin_id').value,
        a_fname: document.getElementById('a_fname').value,
        a_lname: document.getElementById('a_lname').value,
        a_birthdate: document.getElementById('a_birthdate').value,
        a_email: document.getElementById('a_email').value,
    };

    axios.put(`${API_URL}/admin`, updatedAdmin)
        .then(() => {
            swal.fire({
                title: "Updated!",
                text: "Admin details updated successfully.",
                icon: "success"
            }).then(() => {
                closeModal();
                fetchAdmins();
            });
        })
        .catch(error => {
            console.error('Error updating admin:', error);
            swal.fire({
                title: "Error!",
                text: "Failed to update admin details.",
                icon: "error"
            });
        });
}

function openEditModal() {
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function setupModalEvents() {
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
}

function deleteAdmin(adminId) {
    swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${API_URL}/admin/${adminId}`)
                .then(() => {
                    swal.fire({
                        title: "Deleted!",
                        text: "The admin record has been deleted.",
                        icon: "success"
                    }).then(() => {
                        fetchAdmins();
                    });
                })
                .catch(error => {
                    console.error("Error deleting admin:", error);
                    swal.fire({
                        title: "Error!",
                        text: "There was an issue deleting the admin record.",
                        icon: "error"
                    });
                });
        }
    });
}

// Format date to YYYY-MM-DD
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
