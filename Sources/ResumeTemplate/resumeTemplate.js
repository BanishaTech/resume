const descriptionPath = "/Sources/Components/Description/description.html";
const skillsPath = "/Sources/Components/Skills/skills.html";

const skillItemList = [{
    skillTitle: "HTML5",
    percentage: 33
}, {
    skillTitle: "CSS3",
    percentage: 12
}, {
    skillTitle: "JS",
    percentage: 100
}
]

document.addEventListener('DOMContentLoaded', (evento) => {
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

                    // Añadir cada elemento <link> al <head> del documento actual
                    linkElements.forEach(link => {
                        document.head.appendChild(link.cloneNode(true));
                    });

                    var skillsContainer = doc.getElementById('skillsContainer');


                    var skillsLevelContainer = doc.getElementById('skillsLevelContainer');
                    skillsContainer.removeChild(skillsLevelContainer)

                    const skillItems = skillsLevelContainer.querySelectorAll('#skillItem');
                    const skillItemTemplate = skillItems[0]; // Obtenemos el HTML del contenedor

                    // Eliminar los elementos skillItem del contenedor de habilidades
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
                    // Añade el skillsContainer al body

                    document.body.appendChild(skillsContainer);

                })
                .catch(error => console.error('Error al cargar el componente:', error));
        })
        .catch(error => console.error('Error al cargar el componente:', error));
});

