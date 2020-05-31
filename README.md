# Portfolio

## Table of Contents
+ [About](#about)
+ [Usage](#usage)

## About <a name = "about"></a>
A stylized portfolio page of a GitHub user's repositories.

## Usage <a name = "usage"></a>

1. Add query holding username of GitHub user
    - eg. `https://www.edwardwibowo.com/portfolio?user=claby2`

This should display the user's repositories.

### API Key (optional)

This application does not require an API key but you may supply one yourself to decrease the rate limit.

To use your own API key, you may do the following:
1. Create a file in the directory named `config.js`
2. In `config.js` file, add:
    ```
    var config = {
    KEY : 'INSERT_YOUR_KEY_HERE'
    }
    ```
3. Uncomment the line `<!-- <script src = "config.js" id = "configAuth"></script> -->` in `index.html`
    - eg. replace the line with `<script src = "config.js" id = "configAuth"></script>`

Check the console to see if your API key is being read. It should log `You are using an API key.` to the console if successful.