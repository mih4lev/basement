const requestAuth = async (accessToken) => {
    const request = await fetch(`/api/users/login/facebook/${accessToken}`, { method: `POST` });
    const data = await request.json();
    if (data.status !== 1) return false; // show error message
    location.href = `/profile/`;
};

const requestFacebookData = () => {
    FB.login(function(response) {
        if (response.authResponse) {
            requestAuth(response.authResponse.accessToken);
        }
    }, { scope: 'public_profile,email'} );
};

export const facebookAuth = () => {
    const facebookButtons = [...document.querySelectorAll(`.networkButton.facebookButton`)];
    facebookButtons.forEach((facebookButton) => {
        facebookButton.addEventListener(`click`, requestFacebookData);
    });
};