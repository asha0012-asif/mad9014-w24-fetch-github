const APP = {
    userName: document.getElementById('user-name'),
    repoList: document.getElementById('repo-list'),

    init: () => {
        let searchBtn = document.getElementById('search-btn');
        let clearBtn = document.getElementById('clear-btn');
        
        searchBtn.addEventListener('click', APP.fetchResults);
        
        clearBtn.addEventListener('click', () => {
            // reset the message to the default message
            APP.displayMessage();

            // clear both the input inside the searchbar (userName) and repolist ul
            APP.userName.value = "";
            APP.repoList.innerHTML = "";
        })
    },

    fetchResults(ev) {
        ev.preventDefault();

        // clear the innerHTML for every new search
        APP.repoList.innerHTML = "";

        let username = APP.userName.value.trim();
        console.log(`Username: ${username}`);

        // if there is no input, display relevant message and do not continue
        if (username === "") {
            APP.displayMessage("No Match for Empty Value", "#bd1f36");
            return;
        }
        
        let url = `https://api.github.com/users/${username}/repos`;
        
        fetch(url)
        .then((response) => {
            console.log(response);
            
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .then((data) => {
            console.log(data);
            
            // if no repos are found, display the relevant message
            if (data.length === 0) {
                APP.displayMessage(`No REPOS for ${username}`, "#bd1f36");
            
            // else repos are found, so display the relevant message and data (repos)
            } else {
                APP.displayMessage(`REPOS for ${username}`, "#000");
                
                let df = new DocumentFragment();
    
                data.forEach(repo => {
                    let list = document.createElement("li");
                    list.classList.add("repo-list__item");
                    list.innerHTML = `
                        <div>
                            <p><a href="${repo.html_url}" target="_blank" class="repo-list__item-title">${repo.name}</a></p>
                            <p class="repo-list__item-watchers">Watchers: ${repo.watchers}</p>
                            <p class="repo-list__item-issues">Open Issues: ${repo.open_issues}</p>
                        </div>
                    `
                    df.append(list);
                });
    
                APP.repoList.append(df);
            }
    
        })
        .catch((err) => {            
            console.error("There was an error:", err);
        })
    },

    displayMessage: (newMessage="GitHub User Public Repos Search", newColor="#000") => {
        let message = document.getElementById('message');
        message.innerText = newMessage;
        message.style.color = newColor;
    }
}

window.addEventListener('DOMContentLoaded', APP.init);
