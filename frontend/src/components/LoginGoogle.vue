<script setup>
    import { ref, onMounted } from 'vue'
    import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'

    const VITE_API_HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
    const API_URL = VITE_API_HOST+`/api/v1`

    const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


    function myLogin( googleToken ) {
        fetch(API_URL+'/authentications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { googleToken: googleToken } ),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please
            setLoggedUser(data)
            // loggedUser.token = data.token;
            // loggedUser.email = data.email;
            // loggedUser.id = data.id;
            // loggedUser.self = data.self;
            emit('login', loggedUser)
            return;
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here

    };

    const googleLoginBtn = ref(null);

    onMounted( () => {

        // https://developers.google.com/identity/gsi/web/reference/js-reference?hl=it
        
        let google_gsi_client = document.createElement('script');
        google_gsi_client.setAttribute('src', 'https://accounts.google.com/gsi/client');
        document.head.appendChild(google_gsi_client);
        
        window.onload = function () {
            google.accounts.id.initialize({
                client_id: VITE_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                // login_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
            });
            google.accounts.id.renderButton(
                googleLoginBtn.value, {
                    text: 'signin_with', // or 'signup_with' | 'continue_with' | 'signin'
                    size: 'large', // or 'small' | 'medium'
                    width: '366', // max width 400
                    theme: 'outline', // or 'filled_black' |  'filled_blue'
                    logo_alignment: 'left' // or 'center'
                }
            );
            google.accounts.id.prompt(); // also display the One Tap dialog
        };

    });
    
    function handleCredentialResponse( response ) {
        console.log(response);
        if (response.credential) {
            myLogin( response.credential );
        }
    }

</script>

<template>

    <div ref="googleLoginBtn"></div>

</template>
