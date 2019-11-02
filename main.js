/*

    Din uppgift

    Du skall med hjälp av HTML, CSS och Javascript göra en todo-applikation.
    I applikationen skall en användare kunna lägga till och ta bort ärenden från en “att göra”-lista.
    Du får göra precis som du vill med styling. Applikationen har olika krav beroende på betygsnivå.


    Krav för godkänt (G):

    Applikationen skall ha ett inmatningsfält med tillhörande knapp där användaren kan fylla i en ny todo.

    När användaren klickar på en “lägg till”-knapp, eller trycker på Enter-tangenten på tangentbordet skall 
    todo:n läggas till i en lista på todos. Inmatningsfältet skall tömmas när en todo lags till i listan.

    Applikationen skall även ha en lista över redan inmatade todos.
    I listan över inmatade todos skall det också finnas en knapp för varje todo, 
    där användaren kan ta bort en todo ur listan. 
    När användaren klickar på “ta bort”-knappen skall todo:n tas bort ur listan.

    Applikationen skall även ha ett fält som kan användas för att filtrera todos.
    När användaren skriver i fältet skall bara de todos som innehåller textsträngen användaren skriver in synas.
    Om fältet är tomt skall alla todos visas.


    Krav för väl godkänt (VG):

    Applikationen skall ha ett formulär där användaren kan fylla i sin todo.

    Det skall innehålla:
    - ett textfält där själva ärendet kan skrivas in
    - ett datumfält där ett sista datum för ärendet skall väljas, fältet skall ha dagens datum som defaultvärde
    - en selectbox där användaren kan välja vilken kategori ärendet tillhör. Du kan själv välja vilka kategorier som 
    skall finnas (t.ex. “hushållsarbete” eller “jobb”)
    - en “lägg till”-knapp
    - När användaren “skickar formuläret” (klickar på knappen) så skall ärendet läggas till i en todolista.

    Applikationen skall även ha en lista över redan inmatade todos.
    I listan skall man se själva ärendetexten, slutdatumet, kategorin för varje todo.
    Om slutdatumet är tidigare än dagens datum ska det finnas en grafisk varning som visar att slutdatumet är passerat.
    I listan över inmatade todos skall det också finnas en knapp för varje todo, 
    där användaren kan ta bort en todo ur listan.
    När användaren klickar på “ta bort”-knappen skall todo:n tas bort ur listan.

    Applikationen skall även ha ett fält som kan användas för att filtrera todos.
    När användaren skriver i fältet skall bara de todos som innehåller textsträngen användaren skriver in synas.
    Om fältet är tomt skall alla todos visas.

    Applikationen skall även ha en lista med radiobuttons, en för varje kategori, och en för “alla”.
    Om användaren klickar i en radiobutton skall bara ärenden för den kategorin visas.

    Om både en radiobutton är iklickad och fritextfältet har text skall båda användas.
    Filtrera först fram allt som är i en viss kategori, och gör sedan fritextfiltreringen baserat på det.

 */

const toDoItems = [
    {
        "task": "clean house",
        "deadline": "2019-11-02",
        "category": "Work",
    },
    {
        "task": "watch a movie",
        "deadline": "2019-11-02",
        "category": "R&R",
    },
    {
        "task": "bake a cake",
        "deadline": "2019-11-01",
        "category": "Misc",
    },
];


const TASK_CATEGORIES = [
    "All",
    "Family",
    "Work",
    "R&R",
    "Misc",
];


// update new errand date selector min value
function updateMinimumDate() {

    const currentDate = new Date();
    const date = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const yyyymmdd = year + "-" + pad(month + 1) + "-" + pad(date);

    const dateInput = document.querySelector("#dateSelector");
    dateInput.setAttribute("value", yyyymmdd);
    dateInput.setAttribute("min", yyyymmdd);

    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

};
updateMinimumDate();


function buildRadioButtons(categories) {

    const container = document.querySelector("#radioButtonContainer");
    categories.forEach(function (category) {

        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "categoryInputGroup");
        input.setAttribute("value", category);
        input.addEventListener("click", function(){
            drawFilteredList(toDoItems);
        });

        if (category === "All")
            input.checked = true;

        const label = document.createElement("label");
        label.textContent = category;
        
        container.appendChild(input);
        container.appendChild(label);

    });
}

buildRadioButtons(TASK_CATEGORIES);


function fillCategoryDropDown() {
    const select = document.querySelector('#categorySelector');
    TASK_CATEGORIES.forEach(function (category) {
        if (category === "All") return;
        const option = document.createElement("option");
        option.setAttribute("value", category);
        option.textContent = category;
        select.appendChild(option);
    });
}
fillCategoryDropDown();


const submitButton = document.querySelector("#newTaskSubmit");
submitButton.addEventListener("click", createNewTask);
function createNewTask() {

    const textInput = document.querySelector("#newTaskInput");

    // task description can't be empty
    if (textInput.value.length === 0) {
        textInput.focus();
        textInput.classList.replace("borderWhite", "borderRed");
        return;
    }

    // deadline can't be before today
    const dateInput = document.querySelector("#dateSelector")
    const now = new Date();
    const date = new Date(dateInput.value);
    if ((date - now) < 0) {
        dateInput.focus();
        return;
    }

    textInput.classList.replace("borderRed", "borderWhite");

    const newTask = {};
    newTask["task"] = textInput.value;
    newTask["category"] = document.querySelector("#categorySelector").value;
    newTask["deadline"] = document.querySelector("#dateSelector").value

    textInput.value = "";
    //textInput.focus();
    toDoItems.push(newTask);
    drawFilteredList(toDoItems);

}


const filterField = document.querySelector('#filterInput');
filterField.addEventListener('input', function (){
    drawFilteredList(toDoItems);
});

function drawFilteredList(toDoItems) {
    const filterField = document.querySelector('#filterInput');
    const filteredItems = toDoItems.filter(function (item) {
        const includesKeyword = item["task"].toLowerCase().includes(filterField.value.toLowerCase());
        const selectedCategory = document.querySelector('input[name="categoryInputGroup"]:checked').value;
        const correctCategory = (selectedCategory === 'All') || (selectedCategory === item['category'])
        return includesKeyword && correctCategory;

    });
    drawTodoList(filteredItems);
}


function drawTodoList(toDoItems) {

    const newList = document.createElement("tbody");
    newList.setAttribute("id", "todo-table-body");

    toDoItems.forEach(function (item, index) {

        const tr = document.createElement("tr");

        const tdTask = document.createElement("td");
        tdTask.textContent = `${index + 1}. ${item['task']}`;
        tr.appendChild(tdTask);

        const tdDate = document.createElement("td");
        tdDate.textContent = item['deadline'];
        tdDate.classList.add("dealineCell");
        tr.appendChild(tdDate);

        const tdCategory = document.createElement("td");
        tdCategory.classList.add("categoryCell");
        tdCategory.textContent = item['category'];
        tr.appendChild(tdCategory);

        const tdDelete = document.createElement("td");
        tdDelete.classList.add("deleteButtonCell");
        tdDelete.setAttribute("id", "deleteItem" + (index + 1) + "Button");
        tdDelete.addEventListener("click", clickDeleteButton);
        tdDelete.textContent = '🗑️';
        tr.appendChild(tdDelete);

        newList.appendChild(tr);

    });

    const oldList = document.querySelector("#todo-table-body");
    document.querySelector("#todo-table").replaceChild(newList, oldList);

}

drawTodoList(toDoItems);



function clickDeleteButton(e) {
    let itemIndex = Number(e.currentTarget.getAttribute("id").match(/\d+/));
    itemIndex--; // list is 1 to n, array is 0 to n-1 
    deleteListItem(itemIndex);
}


function deleteListItem(index) {
    if (index > -1 && index < toDoItems.length)
        toDoItems.splice(index, 1);
    drawTodoList(toDoItems);
}


const taskDescriptionField = document.querySelector("#newTaskInput");
taskDescriptionField.addEventListener('input', function (e) {
    // reset input field border color
    e.currentTarget.classList.remove("borderRed");
    e.currentTarget.classList.add("borderWhite");
});



