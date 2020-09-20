const requestAuth = async (accessToken) => {
    const request = await fetch(`/api/users/login/facebook/${accessToken}`, { method: `POST` });
    const data = await request.json();
    if (data.status !== 1) return false; // show error message
    location.href = `/profile/`;
};

const requestFacebookData = () => {
    FB.getLoginStatus(function(response) {
        if (response.authResponse) {
            requestAuth(response.authResponse.accessToken);
        } else {
            FB.login(function(response) {
                if (response.authResponse) {
                    requestAuth(response.authResponse.accessToken);
                }
            }, { scope: 'public_profile,email'} );
        }
    });
};

window.fbAsyncInit = function() {
    FB.init({ appId: `2691439147789974`, cookie: true, xfbml: true, version: 'v8.0' });
};

export const facebookAuth = () => {
    const facebookButton = document.querySelector(`.networkButton.facebookButton`);
    facebookButton.addEventListener(`click`, requestFacebookData);
};