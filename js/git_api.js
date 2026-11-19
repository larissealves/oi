const API = `https://api.github.com/repos/larissealves/`

async function fetchDataReadme() {
    const apiUrl = `${API}larissealves/readme`;

    try{
        const response = await fetch(apiUrl, {
            headers:{
                Accept: "application/vnd.github.raw+json"
            }
        });

        if (!response.ok) {
            
        }

        const data = await response.text();
        console.log(data);
        document.querySelector('.teste').textContent = data;
    }
    
    catch (error) {
        console.log("Error fetching data: ", error)
    }
}

fetchDataReadme()