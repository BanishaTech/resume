const descriptionPath = "/Sources/Components/Description/description.html";
const skillsPath = "/Sources/Components/Skills/skills.html";
const educationSectionPath = "/Sources/Components/EducationSection/educationSection.html";
const professionalExperienceSectionPath = "/Sources/Components/ProfessionalExperience/professionalExperience.html";
const languageSectionPath = "/Sources/Components/LanguageSection/languageSection.html";
const hobbiesSectionPath = "/Sources/Components/HobbiesSection/hobbiesSection.html";
const whereIAmSectionPath = "/Sources/Components/WhereIAmSection/whereIAmSection.html";
const esJSON = "/Resources/banisha_es.json";
const enJSON = "/Resources/banisha_en.json";
const caJSON = "/Resources/banisha_ca.json";

const skillItemList = [{
    skillTitle: "HTML5",
    percentage: 33
}, {
    skillTitle: "CSS3",
    percentage: 12
}, {
    skillTitle: "JS",
    percentage: 30
}
]

document.addEventListener('DOMContentLoaded', async () => {
    const jsonToDownload = getJsonLanguague();
    let resumeObject = await getJsonData(jsonToDownload)
    console.log(resumeObject)
    fetch(descriptionPath)
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML += data;
        })
        .then(_ => {
            fetch(skillsPath)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');

                    const linkElements = doc.querySelectorAll('link');

                    // Add each link element to the head
                    linkElements.forEach(link => {
                        document.head.appendChild(link.cloneNode(true));
                    });

                    var skillsContainer = doc.getElementById('skillsContainer');


                    var skillsLevelContainer = doc.getElementById('skillsLevelContainer');
                    skillsContainer.removeChild(skillsLevelContainer)

                    const skillItems = skillsLevelContainer.querySelectorAll('#skillItem');
                    const skillItemTemplate = skillItems[0]; // Get the first skill item to use it as template

                    // Remove the items inside of skill item container because they are samples
                    skillItems.forEach(skillItem => {
                        skillItem.parentNode.removeChild(skillItem);
                    });

                    const skillItemElements = skillItemList.map(skillItem => {
                        var skillItemTemplateCloneNode = skillItemTemplate.cloneNode(true)

                        let contentModified = skillItemTemplateCloneNode.innerHTML.replace(/{{(.*?)}}/g, (_, key) => skillItem[key] || `{{${key}}}`);
                        skillItemTemplateCloneNode.innerHTML = contentModified;

                        skillItemTemplateCloneNode.querySelector('#progressBarFill').style.width = skillItem.percentage + "%";
                        return skillItemTemplateCloneNode;
                    });

                    skillItemElements.forEach(skillItem => {
                        skillsLevelContainer.appendChild(skillItem);
                    });

                    skillsContainer.innerHTML += skillsLevelContainer.outerHTML
                    // Add the skill containe to the body

                    document.body.appendChild(skillsContainer);

                    fetch(educationSectionPath)
                        .then(response => response.text())
                        .then(data => {
                            document.body.innerHTML += data;
                            fetch(languageSectionPath)
                            .then(response => response.text())
                            .then(data => {
                             document.body.innerHTML += data;

                            
                            fetch(professionalExperienceSectionPath)
                                .then(response => response.text())
                                .then(data => {
                                    document.body.innerHTML += data;
                                
                                fetch(hobbiesSectionPath)
                                .then( response => response.text())
                                .then(data => {
                                 document.body.innerHTML += data;

                                 fetch(whereIAmSectionPath)
                                 .then(response => response.text())
                                 .then(data => {
                                  document.body.innerHTML += data;
                                    document.body.innerHTML = replaceAllKeysIn(document.body.innerHTML, resumeObject)
                                    console.log(resumeObject)
                                })
                            })
                        })
                        })



                        })
                })
                .catch(error => console.error('Error al cargar el componente:', error));
        })
        .catch(error => console.error('Error al cargar el componente:', error));
});


function getJsonLanguague() {
    const url = new URL(window.location.href);

    const params = new URLSearchParams(url.search);

    const paramValue = params.get('lang') ?? "en";
    var jsonToDownload

    switch (paramValue) {
        case "en":
            jsonToDownload = enJSON;
            break;

        case "es":
            jsonToDownload = esJSON;
            break;

        case "ca":
            jsonToDownload = caJSON;
            break;

        default:
            jsonToDownload = enJSON;
            break;

    };

    return jsonToDownload;
}


async function getJsonData(jsonURL) {
    const jsonResponse = await fetch(jsonURL);
    return await jsonResponse.json();
}


function replaceAllKeysIn(stringToReplace, dataMap) {
    return stringToReplace.replace(/{{(.*?)}}/g, (_, key) => dataMap[key] || `{{${key}}}`);
}

function addHTMLComponentLinks(data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const linkElements = doc.querySelectorAll('link');

    // Selecciona todos los elementos link dentro de head

    // Add each link element to the head
    linkElements.forEach(link => {
        document.head.appendChild(link.cloneNode(true));
    });
}