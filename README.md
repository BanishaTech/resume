# Banisha's resume

This is my first project and it's going to be about my personal resume.

## Tecnology Used

1. HTML5
2. CSS3
3. JS

## Resources used 

1. JSON
    * I've created 3 JSON files each one for diferent languagues(Spanish, English, Catalan). It's one contain my resume data and Item translations.
2. Favicon
    * I've created it using [favicon website](https://favicon.io/favicon-generator/)


## Structure

The structure that I've used consist of a divison of the main HTML into HTML components.
Each components is inside of Sources/Components with its CSS style. 


## Flow
The main HTML that is loading.html shows a loading, when the HTML loads its JavaScript (resumeTemplate.js) Make a check about the languague, then, choose a JSON path, in consequence the JS download the JSON. Later it start to download the components, parse them and fill them with the data in the JSON. 
At the end, the JS replace the body after 4 seconds. 

## Considerations

Also, I used GitHub, creating branches and merching them to the main after review them in a pull request.
The resume is hosted in GitHub pages available at [Resume](https://banishatech.github.io/resume/)
For this purpose I've created at the root of the git an index html that makes redirection to the loading html.

You can change the languague in [Loading.html](https://banishatech.github.io/resume/Sources/Loading/loading.html)
Using a URL parameter "lang" with the values es, en & ca

The designed is responsive, creating some CSS styles for mobile.

