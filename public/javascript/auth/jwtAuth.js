// check login status
function checkStatus() {
  // Get access tokem from browser sessionStorage
  const accessToken = sessionStorage.getItem('accessToken');
  // Check if expired
  const expirationDate = new Date(Number.parseInt(sessionStorage.getItem('expirationDate')));
  const isExpired = expirationDate < new Date();
  let status;

  // Log details to console
  if (!accessToken) {
    status = 'There is no access token present in local storage, meaning that you are not logged in.';
  } else if (isExpired) {
    status = 'There is an expired access token in local storage.';
  } else {
    status = `There is an access token in local storage, and it expires on ${expirationDate}.`;
  }
  console.log("status: ", status);

  // If logged in
  if (accessToken && !isExpired) {
    return true;
  }
  return false;
}


// Get access token (from session storage, etc.)
function getAccessToken() {
  return sessionStorage.getItem('accessToken');
}

// Save the token to session storage 
function saveAuthResult(result) {
  sessionStorage.setItem('accessToken', result.accessToken);
  sessionStorage.setItem('idToken', result.idToken);
  sessionStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
  // Refresh the page
  checkStatus();
}

// Check token validity + refresh if expired
function checkSession() {
  auth0WebAuth.checkSession({
    responseType: 'token id_token',
    timeout: 5000,
    usePostMessage: true
  }, function (err, result) {
    if (err) {
      console.log(`Could not get a new token using silent authentication (${err.error}).`);
      return false;
    } else {
      saveAuthResult(result);
    }
    return true;
  });
}

//
// use jwt-decode to check if jwt contains a permission for the user
// return true or false
function checkAuth(permission) {
  // read the JWT
  const jwt = getAccessToken();
  // check permissions (if a jwt was returned)
  if (jwt == null) {
    return false;
  }
  const decoded = jwt_decode(jwt);
  return decoded.permissions.includes(permission);  
} // End function
