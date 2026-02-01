// Toggle dropdown
// function toggleDropdown() {
//   const menu = document.getElementById("dropdownMenu");
//   if (menu) {
//     menu.style.display = menu.style.display === "block" ? "none" : "block";
//   }
// }

// Change selected period
function changePeriod(period) {
  const selectedPeriod = document.getElementById("selected-period");
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (selectedPeriod && dropdownMenu) {
    selectedPeriod.innerText = period;
    dropdownMenu.style.display = "none";
  }
}

// Close dropdown when clicking elsewhere
window.addEventListener('click', function (e) {
  if (!e.target.matches('#selected-period') && !e.target.matches('#selected-period img')) {
    const dropdownMenu = document.getElementById("dropdownMenu");
    if (dropdownMenu) {
      dropdownMenu.style.display = "none";
    }
  }
});

// Modal and Add Event functionality
document.addEventListener('DOMContentLoaded', function () {
  const addEventModal = document.getElementById('addEventModal');
  const openAddEventModalBtn = document.getElementById('openAddEventModal');
  const closeAddEventModalBtn = document.getElementById('closeAddEventModal');
  const addEventBtn = document.getElementById('addEventBtn');
  const eventImageUpload = document.getElementById('eventImageUpload');

  if (openAddEventModalBtn && addEventModal) {
    openAddEventModalBtn.addEventListener('click', function () {
      addEventModal.style.display = 'flex';
    });
  }

  if (closeAddEventModalBtn && addEventModal) {
    closeAddEventModalBtn.addEventListener('click', function () {
      addEventModal.style.display = 'none';
    });
  }

  if (addEventModal) {
    addEventModal.addEventListener('click', function (e) {
      if (e.target === addEventModal) {
        addEventModal.style.display = 'none';
      }
    });
  }

});
