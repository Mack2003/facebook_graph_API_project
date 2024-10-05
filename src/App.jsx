import { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed with `npm install axios` or `yarn add axios`
import './index.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID; // Ensure your App ID is set in .env file
  console.log(appId)
  useEffect(() => {
    // Load the Facebook SDK
    window.fbAsyncInit = function() {
      console.log('FB SDK Loaded');
      FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v13.0.2',
      });
    };
    
    (function(d, s, id) {
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      const fjs = d.getElementsByTagName('script')[0];
      if (d.getElementById(id)) return;
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = function() {
        console.log('FB SDK Script Loaded');
      };
    }(document, 'script', 'facebook-jssdk'));
  }, [appId]);

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        fetchUserData(response.authResponse.accessToken);
      } else {
        setError('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'public_profile,email,user_managed_groups,pages_show_list' });
  };

  const fetchUserData = async (accessToken) => {
    try {
      const userResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
      const pagesResponse = await axios.get(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);

      setUserData({
        user: userResponse.data,
        pages: pagesResponse.data.data,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Facebook Graph API Demo</h1>
      <button onClick={handleLogin}>Login with Facebook</button>
      {error && <p>Error: {error}</p>}
      {userData && (
        <div>
          <h2>User Details</h2>
          <p>ID: {userData.user.id}</p>
          <p>Name: {userData.user.name}</p>
          <p>Email: {userData.user.email}</p>
          <h2>Your Pages</h2>
          <ul>
            {userData.pages.map(page => (
              <li key={page.id}>{page.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
