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
                .then(componentHTMLData => {

                    const sectionName = "skillsContainer"
                    const itemListContainerName = "skillsLevelContainer"
                    const itemContainerName = "skillItem"

                    fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.skills);

                    fetch(educationSectionPath)
                        .then(response => response.text())
                        .then(componentHTMLData => {
                            const sectionName = "educationSection";
                            const itemListContainerName = "educationItemsContainer";
                            const itemContainerName = "educationItemContainer";

                            fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.educationItems);

                            fetch(languageSectionPath)
                                .then(response => response.text())
                                .then(componentHTMLData => {
                                    const sectionName = "languageSectionContainer";
                                    const itemListContainerName = "languageItems";
                                    const itemContainerName = "languageItem";

                                    fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.languageItems);

                                    fetch(professionalExperienceSectionPath)
                                        .then(response => response.text())
                                        .then(componentHTMLData => {
                                            const sectionName = "professionalExperience";
                                            const itemListContainerName = "professionalExperienceItems";
                                            const itemContainerName = "professionalExperienceItem";

                                            fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.professionalExperienceItems);

                                            fetch(hobbiesSectionPath)
                                                .then(response => response.text())
                                                .then(componentHTMLData => {
                                                    const sectionName = "hobbiesSectionContainer";
                                                    const itemListContainerName = "hobbiesItemsContainer";
                                                    const itemContainerName = "hobbiesItem";

                                                    fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.hobbies);
                                                    fetch(whereIAmSectionPath)
                                                        .then(response => response.text())
                                                        .then(componentHTMLData => {

                                                            const sectionName = "whereIAmContainer";
                                                            const itemListContainerName = "whereIAmItems";
                                                            const itemContainerName = "whereIAmItem";

                                                            fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, resumeObject.whereIAm);

                                                            document.body.innerHTML = replaceAllKeysIn(document.body.innerHTML, resumeObject)

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


function getHTMLDocument(data) {
    const parser = new DOMParser();
    return parser.parseFromString(data, 'text/html');
}

function addHTMLComponentLinks(doc) {
    const linkElements = doc.querySelectorAll('link');
    linkElements.forEach(link => {
        document.head.appendChild(link.cloneNode(true));
    });
}

function getItemTemplate(doc, containerName, itemTemplateClass) {
    const container = doc.getElementById(containerName);
    return container.querySelectorAll("." + itemTemplateClass)[0];
}


function removeItemTemplates(componentDocument, containerName, itemTemplateClass) {
    const container = componentDocument.getElementById(containerName);
    console.log(container)
    const items = container.querySelectorAll("." + itemTemplateClass);

    items.forEach(item => {
        container.removeChild(item)
    });
}

function fillItems(container, dataToFill, template) {
    dataToFill.forEach(dataItemToFill => {
        const templateItem = template.cloneNode(true);
        container.innerHTML += replaceAllKeysIn(templateItem.outerHTML, dataItemToFill)
    })
}


function fillTemplateComponent(componentHTMLData, sectionName, itemListContainerName, itemContainerName, elementsToFill) {
    var doc = getHTMLDocument(componentHTMLData);
    addHTMLComponentLinks(doc);

    console.log(doc);
    console.log(itemListContainerName);
    console.log(itemContainerName);

    const itemTemplate = getItemTemplate(doc, itemListContainerName, itemContainerName);
    console.log(itemTemplate);
    removeItemTemplates(doc, itemListContainerName, itemContainerName)

    const itemsContainer = doc.getElementById(itemListContainerName);
    const section = doc.getElementById(sectionName);
    section.removeChild(itemsContainer);

    fillItems(itemsContainer, elementsToFill, itemTemplate);

    section.appendChild(itemsContainer);
    document.body.innerHTML += section.outerHTML;
}