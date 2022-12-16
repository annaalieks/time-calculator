'use strict';

// CALENDAR VARIABLES SET

const from = document.querySelector('#start-date');
const to = document.querySelector('#end-date');
const week = document.querySelector('#week');
const month = document.querySelector('#month');
const secondDateArea = document.querySelector('#second-date-area');
const errorMessage = document.createElement('small');
const dropdownButton = document.querySelector('.dropdown__btn');
const result = document.querySelector('.result');
const clear = document.querySelector('.btn');

const menu = document.querySelector('.dropdown__menu');
const menuOuter = document.querySelector('#dropdown__menu--outer');
const menuInnerDays = document.querySelector('#all-days-menu');
const menuInnerBd = document.querySelector('#business-days-menu');
const menuInnerWknds = document.querySelector('#weekends-menu');

let firstDate;
let secondDate;
const day = 1;
const hour = day * 24;
const minute = hour * 60;
const second = minute * 60;

//TABLE VARIABLES SET

let history = document.querySelector('.history');
let noHistory = document.querySelector('.no-history');
let historyArray = new Array();

// EVENT LISTENERS

window.addEventListener('DOMContentLoaded', displayHistory);
from.addEventListener('change', disableInputs);
secondDateArea.addEventListener('click', showErrorMessage);
from.addEventListener('change', hideErrormessage);
to.addEventListener('click', minDatePicker);
from.addEventListener('click', maxDatePicker);
week.addEventListener('change', setWeekPreset)
month.addEventListener('change', setMonthPreset);
to.addEventListener('change', clearPresets);
from.addEventListener('change', showClearButton);
clear.addEventListener('click', clearAllSettings);
dropdownButton.addEventListener('click', showDropdown);
from.addEventListener('input', showResult);
to.addEventListener('input', showResult);
week.addEventListener('change', showResult);
month.addEventListener('change', showResult);

// FUNCTIONS


// Enable second date option selection only while first date is selected
// Remove settings of second date area, if first date is reset

function disableInputs() {
    if (!this.value) {
        to.setAttribute('disabled', '');
        week.setAttribute('disabled', '');
        month.setAttribute('disabled', '');    
        week.checked = false;
        month.checked = false;
        to.value = '';
    } else {
        to.removeAttribute('disabled');
        week.removeAttribute('disabled');
        month.removeAttribute('disabled');
    }
};

// Display error message if second date is clicked before selecting first date

function showErrorMessage() {
    if (!from.value) {
        errorMessage.classList.add('error');
        errorMessage.textContent = 'Please select start date';
        from.after(errorMessage);
    }
};

// Hide error message if first date is selected

function hideErrormessage() {
    if (this.value) {
        errorMessage.remove();  
    }
};

// Set the first date value as the min date value for second date 

function minDatePicker(){
    to.min = from.value;
};

// Set the second date value as the max date value for first date 

function maxDatePicker(){
    from.max = to.value;
};

// Week preset adds 7 days after chosen date

function setWeekPreset() {
    firstDate = new Date(from.value);
    secondDate = new Date(firstDate.setDate(firstDate.getDate() + 7)).toISOString().split('T')[0];
    to.value = secondDate;
};

// Week preset adds 30 days after chosen date

function setMonthPreset() {
    firstDate = new Date(from.value);
    secondDate = new Date(firstDate.setDate(firstDate.getDate() + 30)).toISOString().split('T')[0];
    to.value = secondDate;
};

// Clear presets if 'to' date is selected manually

function clearPresets() {
    if (this.value) {
        week.checked = false;
        month.checked = false;
    }
};

// Add clear button

function showClearButton() {
    if (this.value) {
        clear.style.display = 'block';
    }
};

// Clear all settings

function clearAllSettings() {
    from.value = '';
    to.value = '';
    week.checked = false;
    month.checked = false;
    to.setAttribute('disabled', '');
    week.setAttribute('disabled', '');
    month.setAttribute('disabled', '');  
    dropdownButton.textContent = '';
    menu.style.display = 'none';
    menuInnerDays.style.display = 'none';
    menuInnerBd.style.display = 'none';
    menuInnerWknds.style.display = 'none';
    result.textContent = '';
    this.style.display = 'none';
};

// Toggling function template

function toggleDisplay(element) {
    let display = element.style.display; 
    element.style.display = display === 'block' ? 'none' : 'block';
};

// Display/hide dropdown menu on clicking dropdown button

function showDropdown() {
    toggleDisplay(menuOuter);
};

// Creating day array between dates function

function getDaysArray() {
    firstDate = new Date(from.value);
    secondDate = new Date(to.value);

    const dates = [];

    const date = firstDate;

    while (date < secondDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    };

    let daysArray = dates.map(date => date.getDay());

    return daysArray;
};

// Time between dates calculating function template

function timeBetweenDates(timePeriod) {
    
    const days = getDaysArray().length; 

    if (timePeriod === 'days') {
        return days;
    } if (timePeriod === 'hours') {
        return days * hour;
    } if (timePeriod === 'minutes') {
        return days * minute;
    } if (timePeriod === 'seconds') {
        return days * second;
    };
};

// Business time between dates calculating function template

function timeBetweenBusinessDays(timePeriod) {

    const businessDays = getDaysArray().filter(day => (day !== 6 && day !== 0)).length; 

    if (timePeriod === 'days') {
        return businessDays;
    } if (timePeriod === 'hours') {
        return businessDays * hour;
    } if (timePeriod === 'minutes') {
        return businessDays * minute;
    } if (timePeriod === 'seconds') {
        return businessDays * second;
    };
};

// Weekend time between dates calculating function template

function timeBetweenWeekends(timePeriod) {

    const weekends = getDaysArray().filter(day => (day !== 1 && day !== 2 && day !== 3 && day !== 4 && day !== 5)).length;
    
    if (timePeriod === 'days') {
        return weekends;
    } if (timePeriod === 'hours') {
        return weekends * hour;
    } if (timePeriod === 'minutes') {
        return weekends * minute;
    } if (timePeriod === 'seconds') {
        return weekends * second;
    };
};

// Display/hide dropdown inner menus on clicking outer options;
// Display texts in dropdown button value correspoding to each inner option;
// Hide dropdown menus when one of the inner options is chosen;
// Show the corresponding result value if both dates are selected

menu.addEventListener('click', (event) => {
    let target = event.target;
    switch (target.id) {

// Outer menu options functions
        case 'all-days':
            toggleDisplay(menuInnerDays);
            menuInnerBd.style.display = 'none';
            menuInnerWknds.style.display = 'none';
            break;
        case 'business-days':
            menuInnerDays.style.display = 'none';
            toggleDisplay(menuInnerBd);
            menuInnerWknds.style.display = 'none';
            break;
        case 'weekends':
            menuInnerDays.style.display = 'none';
            menuInnerBd.style.display = 'none';
            toggleDisplay(menuInnerWknds);
            break;
        
// All days inner menu options functions       
        case 'days':
            dropdownButton.textContent = 'days';
            menu.style.display = 'none';
            menuInnerDays.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenDates('days');
                addToLocalStorage();
            } else {
                result.textContent = '';
            }; 
            break;
        case 'hours':
            dropdownButton.textContent = 'hrs';
            menu.style.display = 'none';
            menuInnerDays.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenDates('hours');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'minutes':
            dropdownButton.textContent = 'min';
            menu.style.display = 'none';
            menuInnerDays.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenDates('minutes');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'seconds':
            dropdownButton.textContent = 'sec';
            menu.style.display = 'none';
            menuInnerDays.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenDates('seconds');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        
// Business days inner menu options functions       
        case 'bd-days':
            dropdownButton.textContent = 'bd';
            menu.style.display = 'none';
            menuInnerBd.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenBusinessDays('days');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'bd-hours':
            dropdownButton.textContent = 'bd hrs';
            menu.style.display = 'none';
            menuInnerBd.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenBusinessDays('hours');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'bd-minutes':
            dropdownButton.textContent = 'bd min';
            menu.style.display = 'none';
            menuInnerBd.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenBusinessDays('minutes');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'bd-seconds':
            dropdownButton.textContent = 'bd sec';
            menu.style.display = 'none';
            menuInnerBd.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenBusinessDays('seconds');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        
// Weekends inner menu options functions        
        case 'wknds-days':
            dropdownButton.textContent = 'wknds';
            menu.style.display = 'none';
            menuInnerWknds.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenWeekends('days');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'wknds-hours':
            dropdownButton.textContent = 'wknd hrs';
            menu.style.display = 'none';
            menuInnerWknds.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenWeekends('hours');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'wknds-minutes':
            dropdownButton.textContent = 'wknd min';
            menu.style.display = 'none';
            menuInnerWknds.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenWeekends('minutes');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
        case 'wknds-seconds':
            dropdownButton.textContent = 'wknd sec';
            menu.style.display = 'none';
            menuInnerWknds.style.display = 'none';
            if (from.value && to.value) {
                result.textContent = timeBetweenWeekends('seconds');
                addToLocalStorage();
            } else {
                result.textContent = '';
            };
            break;
    }
});

// Show the result for changing date options if days are selected
function showResult() {
    if (from.value && to.value && dropdownButton.textContent === 'days') {
        result.textContent = timeBetweenDates('days');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'hrs') {
        result.textContent = timeBetweenDates('hours');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'min') {
        result.textContent = timeBetweenDates('minutes');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'sec') {
        result.textContent = timeBetweenDates('seconds');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'bd') {
        result.textContent = timeBetweenBusinessDays('days');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'bd hrs') {
        result.textContent = timeBetweenBusinessDays('hours');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'bd min') {
        result.textContent = timeBetweenBusinessDays('minutes');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'bd sec') {
        result.textContent = timeBetweenBusinessDays('seconds');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'wknds') {
        result.textContent = timeBetweenWeekends('days');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'wknd hrs') {
        result.textContent = timeBetweenWeekends('hours');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'wknd min') {
        result.textContent = timeBetweenWeekends('minutes');
        addToLocalStorage();
    } if (from.value && to.value && dropdownButton.textContent === 'wknd sec') {
        result.textContent = timeBetweenWeekends('seconds');
        addToLocalStorage();
    } if (!from.value || !to.value) {
        result.textContent = '';
    };
};

// Display no-history/history options in the table depending on local storage saved data

function setTableView() {

    const savedHistory = localStorage.getItem('localStorageHistory');

    if (savedHistory === null) {
        noHistory.style.display = 'table-row-group';
        history.style.display = 'none';
    } else {
        noHistory.style.display = 'none';
        history.style.display = 'table-row-group';
        historyArray = JSON.parse(savedHistory);
    };
};

// Uploading saved history into the table (if it is available) and updating the table with the new calculating results from the local storage

function displayHistory() {

    setTableView();

    let x = history.rows.length;
    while (x--) {
        history.deleteRow(x);
        console.log(x)
    };

    if (historyArray.length > 10) {
        for (let i = historyArray.length - 1; i >= historyArray.length - 10; i--) {
            let row = history.insertRow();
            let cell1 = row.insertCell();
            let cell2 = row.insertCell();
            let cell3 = row.insertCell();
            let cell4 = row.insertCell();

            cell1.innerHTML = historyArray[i].from;
            cell2.innerHTML = historyArray[i].to;
            cell3.innerHTML = historyArray[i].calculationResult;
            cell4.innerHTML = historyArray[i].calculationOption;
        }; 
    } else {
        for (let i = 0; i < historyArray.length; i++) {
            let row = history.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);

            cell1.innerHTML = historyArray[i].from;
            cell2.innerHTML = historyArray[i].to;
            cell3.innerHTML = historyArray[i].calculationResult;
            cell4.innerHTML = historyArray[i].calculationOption;
        };
    };
};

// Updating local storage with the new calculating data

function addToLocalStorage() {

    setTableView();

    historyArray.push({
        from: from.value.split('-').reverse().join('/'),
        to: to.value.split('-').reverse().join('/'),
        calculationResult: result.textContent,
        calculationOption: dropdownButton.textContent
    });

    localStorage.setItem('localStorageHistory', JSON.stringify(historyArray));
    
    displayHistory();
};