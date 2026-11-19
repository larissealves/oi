const API = `https://api.github.com/repos/larissealves/`
const PROFILE_API = 'https://api.github.com/users/larissealves'

const MAINCONTAINER = document.querySelector('.main-container');
const LANGUAGES = document.querySelector('.languages');

const LINKEDIN = document.querySelector('.linkedin');
const GITHUB = document.querySelector('.github');
const INSTAGRAM = document.querySelector('.instagram');


async function fetchProfileSocialAccount() {
    const apiUrl = `${PROFILE_API}/social_accounts`;
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const socialLinks = await response.json();
        console.log('SOCIALS ==> ', socialLinks)

        socialLinks.forEach(social => {
            const links = document.createElement('a');

            links.href = social.url;
            links.target = "_blank";
            links.rel = 'noopener noreferrer';
            links.textContent = social.provider;

            if (social.provider.toLowerCase() === 'linkedin') {
                LINKEDIN.replaceChildren(links);
            }

            if (social.provider.toLowerCase() === 'instagram') {
                INSTAGRAM.replaceChildren(links);
            }
        });
    }

    catch (error) {
        console.log("Error fetching data - Social links: ", error);
    }
}

async function fetchProfile() {
    try {
        const response = await fetch(PROFILE_API);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const profile = await response.json();

        console.log("PROFILE DETAILS =>", profile)

        document.querySelector(".profile-name").textContent = profile.name || profile.login;
        document.querySelector(".bio").textContent = profile.bio || "";
        document.querySelector(".email").textContent = profile.email || "";
        document.querySelector(".company").textContent = profile.company ? `${'🏢 '} profile.company` : "" ;

    }
    catch (error) {
        console.log("Error fetching data - PROFILE: ", error);
    }
}

async function fetchReadme() {

    const apiUrl = `${API}larissealves/readme`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/vnd.github.raw+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const dataMarkdown = await response.text();
        const html = await marked.parse(dataMarkdown);
        

        console.log("README => ", html)


        const safeHTML = DOMPurify.sanitize(html);


        // Cria um elemento temporário para filtrar o conteúdo
        const temp = document.createElement('div');
        temp.innerHTML = safeHTML;

        const table = temp.querySelector('table');

        if (!table) {
            throw new Error('Tabela não encontrada no README');
        }

        const headers = [...table.querySelectorAll('thead th')]
            .map(th => th.textContent.trim());

        table.querySelectorAll('tbody tr').forEach(row => {
            [...row.cells].forEach((cell, index) => {
                cell.dataset.label = headers[index] || '';
            });
        });

        MAINCONTAINER.replaceChildren(table.cloneNode(true));

        // Extract languages
        const headings = [...temp.querySelectorAll('h1, h2, h3')];

        const languagesHeading = headings.find(
            heading => heading.textContent.trim() === 'Languages'
        );

        if (languagesHeading) {
            let element = languagesHeading;

            LANGUAGES.replaceChildren();

            while (element) {
                if (
                    element !== languagesHeading &&
                    /^H[1-3]$/.test(element.tagName)
                ) break;

                LANGUAGES.appendChild(element.cloneNode(true));
                element = element.nextElementSibling;
            }
        }

    }

    catch (error) {
        console.log("Error fetching data - README: ", error);
        MAINCONTAINER.textContent = "Não foi possível carregar o Readme";
    }
}

fetchProfile();
fetchProfileSocialAccount();
fetchReadme();