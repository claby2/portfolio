function numberWithCommas(x) { // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Replace star and fork number with comma seperated
}

var auth = document.getElementById('configAuth') ? true : false; // Checks if config.js script tag is active (uncommented)

if(auth) {
    console.log("You are using an API key.");
} else {
    console.log("You have no API key active and may be easily rate limited. \nRefer to source to see how you can specify an API key:\nhttps://github.com/claby2/portfolio/blob/master/README.md");
}

const headers = new Headers();

if(auth) {
    headers.append('Authorization', config.KEY); // Set API key from config.js
}

const user = new URLSearchParams(window.location.search).get('user'); // Gets user based on query in URL

var colorsObject; // Object stores colors.json which holds information for language color highlighting
var filteredReposArr = [];
var reposArr = [];

if(user === null) {
    document.getElementById('title').innerText = 'user not specified'; // No user has been specified
    document.title = '/repos';
} else {
    document.getElementById('title').innerText = user + '/repos';
    document.title = user + '/repos';
    
    function getColorsObject() {
        var request = new XMLHttpRequest();
        request.open("GET", "./colors.json", false);
        request.send(null);
        colorsObject = JSON.parse(request.responseText);
    }
    
    getColorsObject(); // Read and store colors.json
    
    function fetchRepos(user) {
        if(auth) { // Pass API key in headers if able
            return fetch('https://api.github.com/users/' + user + '/repos', {
                method: 'GET',
                headers: headers,
            })
            .then(res => res.json());
        } else { // No API key specified
            return fetch('https://api.github.com/users/' + user + '/repos')
            .then(res => res.json());
        }
    }
    
    function appendRepo(repo) {
        let div = document.createElement('div');
        div.classList.add('repoDiv')
        let details = document.createElement('div');
        details.classList.add('repoDetails');
    
        let name = document.createElement('h3');
        let nameLink = document.createElement('a');
        let description = document.createElement('p');
        let language = document.createElement('p');
        let stars = document.createElement('p');
        let forks = document.createElement('p');
    
        nameLink.innerText = repo.name;
        nameLink.href = repo.html_url;
        nameLink.target = '_blank';
        description.innerText = repo.description;
        language.innerText = repo.language;
        stars.innerText = numberWithCommas(repo.stargazers_count) + ' stars';
        forks.innerText = numberWithCommas(repo.forks) + ' forks';
    
        name.appendChild(nameLink);
    
        if(repo.language !== null) {
            if(colorsObject[repo.language].hasOwnProperty('color')) language.setAttribute(
                'style', 
                'color: ' + colorsObject[repo.language]['color'] + '; filter: brightness(200%);' // Set the language color if applicable and add brightness filter for dark mode
            );
            details.appendChild(language);
        }
        if(repo.stargazers_count) details.appendChild(stars);
        if(repo.forks) details.appendChild(forks);
    
        div.appendChild(name);
        div.appendChild(description);
        div.appendChild(details);
    
        document.getElementById('repoList').appendChild(div);
    }
    
    fetchRepos(user).then(repos => {
        repos.forEach(repo => {
            reposArr.push(repo);
            appendRepo(repo);
        })
    })
}

function displayRepos(repos) {
    document.getElementById('repoList').innerText = ''; // Clear repoList
    for(let i = 0; i < repos.length; i++) {
        appendRepo(repos[i]);
    }
}

document.getElementById('searchInput').addEventListener('keyup', ()=> {
    let input = document.getElementById('searchInput').value;
    input = input.toLowerCase(); // Make search input lower case for uniformity
    if(input === "") { // Check if search input has been cleared
        filteredReposArr = reposArr; // If search input is empty, display all repos
    } else {
        filteredReposArr = [];
        filteredReposArr = reposArr.filter((e => (e.name).toLowerCase().indexOf(input) != -1)); // Filter reeposArr based on search input
    }

    displayRepos(filteredReposArr); // Display filtered version of repo
})