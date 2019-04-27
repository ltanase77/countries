window.onload = function() {
    let listItems = document.getElementsByClassName("list-item");

    for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener("mouseover", function(e) {
            this.style.backgroundColor = "#4da6ff";
            this.firstChild.style.color = "white";
            e.stopPropagation();
        });

        listItems[i].addEventListener("mouseout", function(e) {
            this.style.backgroundColor = "white";
            this.firstChild.style.color = "dodgerblue";
            e.stopPropagation();
        });
    }

    if (window.XMLHttpRequest) {
        if (window.location.pathname !== "/Javascript/Countries/index.html") {
            const xhr = new XMLHttpRequest();
            let url = "https://restcountries.eu/rest/v2/all";
            xhr.open("GET", url, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    getData(xhr);
                }
            };
            xhr.send();
        }
    } else {
        console.log("Get a new browser!");
    }
};

function getContinent() {
    //Getting the name of the page that is named after a continent
    let path = window.location.pathname;
    //Getting rid of the slash
    let fileName = path.substring(path.lastIndexOf("/") + 1);
    //Finding where the dot extension start
    let extPos = fileName.indexOf(".");
    //Eliminating the file extension
    let pageName = fileName.slice(0, extPos);
    //Checking if there is a two word name of the page
    //console.log(pageName);
    let continent;
    if (pageName.indexOf("-") === -1) {
        // No match of the character found
        //Capitalizing the one word name of the page
        //console.log('No match');
        continent = pageName.charAt(0).toUpperCase() + pageName.substr(1);
    } else {
        let words = pageName.split("-");
        //console.log(words);
        words[0] = words[0].charAt(0).toUpperCase() + words[0].substr(1);
        words[1] = words[1].charAt(0).toUpperCase() + words[1].substr(1);
        continent = words.join();
        //console.log(continent);
        continent = continent.replace(",", " ");
    }
    //console.log(continent);
    //Returning the name of the page
    return continent;
}

function getData(xhr) {
    //try {
    let continent = getContinent();
    console.log(continent);
    //Parsing the received json data
    let jsonObj = JSON.parse(xhr.responseText);
    //console.log(jsonObj);
    //Selecting the countries from the correspondent continent and push them into an array
    let countries = [];
    for (let i = 0; i < jsonObj.length; i++) {
        if (jsonObj[i].subregion === "Caribbean" || jsonObj.subregion === "Central America") {
            jsonObj[i].subregion = "Northern America";
        }
        if (jsonObj[i].region === continent || jsonObj[i].subregion === continent) {
            countries.push(jsonObj[i]);
        }
    }
    //console.log(countries);
    //Obtaining the name of the table columns based on the keys of the parsed data
    let columnNames = ["name", "flag", "capital", "area", "population"];
    //Getting the element to which will append the table
    let main = document.getElementsByClassName("content");
    //Starting to create the table
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    //Creating the header row
    let headerRow = document.createElement("tr");
    //Creating the header data cells
    for (let i = 0; i < columnNames.length; i++) {
        let headerCell = document.createElement("th");
        headerCell.setAttribute("class", "table-header");
        let headerText;
        if (columnNames[i] === "area") {
            headerText = document.createTextNode(columnNames[i] + "(km2)");
        } else {
            headerText = document.createTextNode(columnNames[i]);
        }

        headerCell.appendChild(headerText);
        headerRow.appendChild(headerCell);
    }
    //Appending the header row to the table
    table.appendChild(headerRow);
    //Creating the table row for each country based on the countries array
    for (let i = 0; i < countries.length; i++) {
        let dataRow = document.createElement("tr");
        for (let j = 0; j < columnNames.length; j++) {
            let dataCell = document.createElement("td");
            dataCell.setAttribute("class", "table-cell flag-cell");
            if (j === 0) {
                let cellText = document.createTextNode(countries[i].name);
                dataCell.appendChild(cellText);
                dataRow.appendChild(dataCell);
            } else if (j === 1) {
                let img = document.createElement("img");
                img.src = "flags/" + countries[i].alpha2Code + ".svg";
                img.width = 50;
                img.height = 30;
                dataCell.appendChild(img);
                dataRow.appendChild(dataCell);
            } else {
                let cellText = document.createTextNode(countries[i][columnNames[j]]);
                dataCell.appendChild(cellText);
                dataRow.appendChild(dataCell);
            }
        }

        table.appendChild(dataRow);
    }

    main[0].appendChild(table);

    //} catch(e) {
    //console.log(e.message);
    //}
}
