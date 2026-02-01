document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Check if both username and password fields are filled
    if (!username || !password) {
        swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please complete all fields",
        });
        return;
    }

    try {
        // Send a POST request to the server with the username and password
        const response = await fetch("http://localhost:3030/login", {
            method: "POST", // Use POST method for login
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include", // Include cookies if needed for session
        });

        // Parse the JSON response from the server
        const result = await response.json();

        // If login is successful (response.ok is true)
        if (response.ok) {
            swal.fire({
                title: "Success!",
                text: "Login successful!",
                icon: "success",
            });
            // Redirect to the user-admin page after 1 second
            setTimeout(() => {
                window.location.href = "/user-admin";
            }, 1000);
        } else {
            // If the login failed, show an error message from the response
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.error || "Login failed.",
            });
        }
    } catch (err) {
        console.error("Error during login:", err); // Log the error to the console
        swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred. Please try again.",
        });
    }
});

document.getElementById('user').addEventListener('click', function () {
    window.location.href = '/login';
});
