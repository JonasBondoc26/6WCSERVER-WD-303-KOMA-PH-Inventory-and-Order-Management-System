// Get the dropdown content and the icon link
const userIconLink = document.getElementById('userIcon');
const dropdownContent = document.getElementById('userDropdownContent');

// Toggle the dropdown when the icon is clicked
userIconLink.addEventListener('click', function(event) {
    // Prevent the link from navigating away
    event.preventDefault(); 
    
    // Toggle the 'show' class, which is defined in CSS to show the menu
    dropdownContent.classList.toggle('show');
});

// Close the dropdown if the user clicks anywhere outside of it
window.addEventListener('click', function(event) {
    if (!userIconLink.contains(event.target) && !dropdownContent.contains(event.target)) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
        }
    }
});

/* *** BONUS: Simple front-end demonstration of login status switching ***
In a real app, this logic would come from the server!
You can uncomment the lines below to test the "logged in" state.
*/
/*
// Example login/logout state simulator:
const isLoggedIn = true; // Change this to 'false' to test the Log In option

const loginOption = document.querySelector('.login-option');
const loggedInOptions = document.querySelectorAll('.logged-in-option');

if (isLoggedIn) {
    loginOption.style.display = 'none';
    loggedInOptions.forEach(el => el.style.display = 'block');
} else {
    loginOption.style.display = 'block';
    loggedInOptions.forEach(el => el.style.display = 'none');
}
*/