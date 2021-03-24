// Get User log in status and update Login links.
// Assign event listeners to logi, logout, and profile links

import { auth0WebAuth, auth0Authentication } from '../../auth/auth0-variables.js';
import * as jwtAuth from '../../auth/jwtAuth.js';

// Show hide menu links based on logged in state
function toggleLinks(loggedIn) {
    // true
    if (loggedIn) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
        document.getElementById('get-profile').style.display = 'block';
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('get-profile').style.display = 'none';
        document.getElementById('AddProductButton').style.display = 'none';
    }
} // End Function

//
// Add Event Handlers for links
//
// Login event handler
// Call Auth0 to handle login (then return here)
document.getElementById('login').addEventListener('click', function (event) {
    // Prevent form submission (if used in a form)
    event.preventDefault();
    // Call the Auth0 authorize function
    // auth0WebAuth is defined in auth0-variables.js
    auth0WebAuth.authorize({ returnTo: auth0WebAuth.redirectUri });
    console.log('Logged in');

}, false);

//
// Logout
// Call Auth0 to handle logout (then return here)
document.getElementById('logout').addEventListener('click', function (event) {
    event.preventDefault();
    // remove tokens from session storage
    sessionStorage.clear();
    auth0WebAuth.logout({ returnTo: auth0WebAuth.redirectUri });
    console.log('Logged out');
}, false);

//
// get user profile from Auth0 
document.getElementById('get-profile').addEventListener('click', async function (event) {
    event.preventDefault();
    auth0Authentication.userInfo(jwtAuth.getAccessToken(), (err, usrInfo) => {
        if (err) {
            // handle error
            console.error('Failed to get userInfo');
            return;
        }
        // Output result to console (for testing purposes) 
        console.log(usrInfo);
        document.getElementById('results').innerHTML = `<pre>${JSON.stringify(usrInfo, null, 2)}</pre>`;
    });
}, false);

//
// check jwt validity every 15 minutes
// refresh token if required
function checkUser() {
    toggleLinks(jwtAuth.checkSession());
    setTimeout(checkUser, 900000);
} // End function

// When page is loaded
window.onload = (event) => {
    // Check for valid Auth0 token
    auth0WebAuth.parseHash(function (err, result) {
        if (result) {
            jwtAuth.saveAuthResult(result);
            toggleLinks(true);
        }
    });
    // check login status after page loads
    // show and hide login/ logout links
    toggleLinks(jwtAuth.checkStatus());
};

// Not yet required
//checkUser();
