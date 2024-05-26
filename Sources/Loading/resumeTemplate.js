const resumeTemplatePath = "Sources/ResumeTemplate/resumeTemplate.html"
const descriptionPath = "Sources/Components/Description/description.html";
const skillsPath = "Sources/Components/Skills/skills.html";
const educationSectionPath = "Sources/Components/EducationSection/educationSection.html";
const professionalExperienceSectionPath = "Sources/Components/ProfessionalExperience/professionalExperience.html";
const languageSectionPath = "Sources/Components/LanguageSection/languageSection.html";
const hobbiesSectionPath = "Sources/Components/HobbiesSection/hobbiesSection.html";
const whereIAmSectionPath = "Sources/Components/WhereIAmSection/whereIAmSection.html";
const esJSON = "Resources/banisha_es.json";
const enJSON = "Resources/banisha_en.json";
const caJSON = "Resources/banisha_ca.json";
const footer = "<footer> © 2024. All right reserved </footer>"

document.addEventListener('DOMContentLoaded', async () => {
    const jsonToDownload = getJsonLanguague();
    let resumeObject = await getJsonData(jsonToDownload);
    const documentCopy = document.cloneNode(true);
    documentCopy.head.outerHTML = "<head></head>"

    try {
        const resumeTemplateData = await loadComponent(resumeTemplatePath);
        documentCopy.body.innerHTML += resumeTemplateData;

        const descriptionData = await loadComponent(descriptionPath);
        documentCopy.body.innerHTML += descriptionData;

        const skillsData = await loadComponent(skillsPath);
        fillTemplateComponent(
            documentCopy, skillsData, "skillsContainer", "skillsLevelContainer", "skillItem",
            resumeObject.skills, (skill, data) => {
                const fillColor = skill.querySelector(".progressBarFill");
                fillColor.style.width = data.percentage + "%";
                return skill;
            }
        );

        const educationData = await loadComponent(educationSectionPath);
        fillTemplateComponent(
            documentCopy, educationData, "educationSection", "educationItemsContainer", "educationItemContainer",
            resumeObject.educationItems
        );

        const languageData = await loadComponent(languageSectionPath);
        fillTemplateComponent(
            documentCopy, languageData, "languageSectionContainer", "languageItems", "languageItem",
            resumeObject.languageItems, (language, data) => {
                const fillColor = language.querySelector(".languageProgressBarColor");
                fillColor.style.width = data.percentage + "%";
                return language;
            }
        );

        const professionalExperienceData = await loadComponent(professionalExperienceSectionPath);
        fillTemplateComponent(
            documentCopy, professionalExperienceData, "professionalExperience", "professionalExperienceItems", "professionalExperienceItem",
            resumeObject.professionalExperienceItems
        );

        const hobbiesData = await loadComponent(hobbiesSectionPath);
        fillTemplateComponent(
            documentCopy, hobbiesData, "hobbiesSectionContainer", "hobbiesItemsContainer", "hobbiesItem",
            resumeObject.hobbies
        );

        const whereIAmData = await loadComponent(whereIAmSectionPath);
        fillTemplateComponent(
            documentCopy, whereIAmData, "whereIAmContainer", "whereIAmItems", "whereIAmItem",
            resumeObject.whereIAm
        );

        setTimeout(() => {
            document.body.outerHTML = replaceAllKeysIn(documentCopy.body.innerHTML, resumeObject) + footer;
            document.head.innerHTML = documentCopy.head.innerHTML;
        }, 4000);

    } catch (error) {
        console.error('Error al cargar el componente:', error);
    }
});

async function loadComponent(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Error al cargar el componente desde ${path}`);
    return response.text();
}

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

function addHTMLComponentLinks(componentDoc, originalDocumentCopy) {
    const linkElements = componentDoc.querySelectorAll('link');
    console.log(linkElements)
    linkElements.forEach(link => {
        originalDocumentCopy.head.appendChild(link.cloneNode(true));
    });

    console.log(originalDocumentCopy.head.innerHTML)
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

function fillItems(container, dataToFill, template, modifyItemBeforeAdd) {
    dataToFill.forEach(dataItemToFill => {
        let templateItem = template.cloneNode(true);
        if (typeof modifyItemBeforeAdd === 'function') {
            templateItem = modifyItemBeforeAdd(templateItem, dataItemToFill);
        }
        container.innerHTML += replaceAllKeysIn(templateItem.outerHTML, dataItemToFill);
    });
}


function fillTemplateComponent(documentCopy, componentHTMLData, sectionName, itemListContainerName, itemContainerName, elementsToFill, modifyItemBeforeAddClosure) {
    var componentDocument = getHTMLDocument(componentHTMLData);
    addHTMLComponentLinks(componentDocument, documentCopy);

    console.log(componentDocument);
    console.log(itemListContainerName);
    console.log(itemContainerName);

    const itemTemplate = getItemTemplate(componentDocument, itemListContainerName, itemContainerName);
    console.log(itemTemplate);
    removeItemTemplates(componentDocument, itemListContainerName, itemContainerName)

    const itemsContainer = componentDocument.getElementById(itemListContainerName);
    const section = componentDocument.getElementById(sectionName);
    section.removeChild(itemsContainer);

    fillItems(itemsContainer, elementsToFill, itemTemplate, modifyItemBeforeAddClosure);

    section.appendChild(itemsContainer);
    documentCopy.body.innerHTML += section.outerHTML;
}