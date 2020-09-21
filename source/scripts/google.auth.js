const client_id = `874100673472-3pqnn9eg8p6fvugc9sqvmh3sv0hmkrpc.apps.googleusercontent.com`;
const googleRequest = { client_id, cookiepolicy: 'single_host_origin', scope: 'profile email' };
const googleButtons = [...document.querySelectorAll(`.networkButton.googleButton`)];

const successResponse = async (googleUser) => {
    const authToken = googleUser.getAuthResponse().id_token;
    const response = await fetch(`/api/users/login/google/` + authToken, { method: `POST` });
    const data = await response.json();
    if (data.status !== 1) return false; // show error message
    location.href = `/profile/`;
};

const errorResponse = (error) => {
    console.log(JSON.stringify(error, undefined, 2));
};

const attachSign = (element) => {
    window.auth2.attachClickHandler(element, {}, successResponse, errorResponse);
};

export const googleAuth = () => {
    gapi.load(`auth2`, function() {
        window.auth2 = gapi.auth2.init(googleRequest);
        googleButtons.forEach((googleButton) => attachSign(googleButton));
    });
};