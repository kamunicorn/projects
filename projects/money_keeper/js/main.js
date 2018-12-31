"use strict";

let expensesInps = document.getElementsByClassName('expenses-item'),
    optExpensesInps = document.querySelectorAll('.optionalexpenses-item'),
    incomeInp = document.querySelector('#income'),
    savingsChekbox = document.querySelector('#savings'),
    savingsSumInp = document.querySelector('#sum'),
    savingsPercentInp = document.querySelector('#percent'),

        // Кнопки
    expensesBtn = document.getElementsByTagName('button')[0],   // Утвердить обязательные расходы
    optExpensesBtn = document.getElementsByTagName('button')[1],    // Утвердить необязательные расходы
    countBudgetBtn = document.getElementsByTagName('button')[2],    // Рассчитать (дневной бюджет)
    startBtn = document.getElementById('start'),    // Кнопка Начать расчет

        // Указанная дата - год, месяц, день (внизу справа)
    yearValue = document.querySelector('.year-value'),
    monthValue = document.querySelector('.month-value'),
    dayValue = document.querySelector('.day-value'),

        // Получение дивов, в которые выводятся результаты подсчетов
    budgetResult = document.getElementsByClassName('budget-value')[0],
    dayBudgetResult = document.getElementsByClassName('daybudget-value')[0],
    levelResult = document.getElementsByClassName('level-value')[0],
    expensesResult = document.getElementsByClassName('expenses-value')[0],
    optExpensesResult = document.getElementsByClassName('optionalexpenses-value')[0],
    incomeResult = document.getElementsByClassName('income-value')[0],
    monthSavingsResult = document.getElementsByClassName('monthsavings-value')[0],
    yearSavingsResult = document.getElementsByClassName('yearsavings-value')[0];
    
    // Наш главный глобальный объект
let appData = {
    budget: undefined,
    timeData: undefined,
    expenses: {},
    optExpense: [],
    income: [],
    savings: false,
    savingsSum: undefined,
    savingsPercent: undefined,
    countSavings: function() {
        if (this.savings && this.savingsSum != undefined && this.savingsPercent != undefined) {
            this.monthIncome = this.savingsSum/100/12 * this.savingsPercent;
            this.yearIncome = this.savingsSum/100 * this.savingsPercent;
        } else {
            this.monthIncome = '';
            this.yearIncome = '';
        }
    }
};
    // полнота (не)обязательных расходов, проверяется в функции verifyDataCompleteness
let expComplete = {},
    optExpComplete = {};

    // Все инпуты очищаются при запуске и перезапеске приложения
    // Все кнопки отключаются, кноме стартовой
    // Все результаты расчетов также очищаются
let allDataInputs = document.querySelectorAll('.data input'),
    allDataButtons = document.querySelectorAll('.data button'),
    resultValues = [];

document.querySelectorAll('.result-table div').forEach( (item) => {
    if (/-value/.test(item.className)) {
        resultValues.push(item);
    }
});

        /*************************************************************************
        Обработчики событий на кнопки, инпуты - навешиваются по отдельности */

window.addEventListener('DOMContentLoaded', function() {
    allDataInputs.forEach( (inp) => {inp.setAttribute('disabled', true);} );
    startApp();
});

    /* Кнопка Начать расчет: Получение значений бюджета (общий), строки даты, и последующая запись всего этого в поля справа */
startBtn.addEventListener('click', () => {
    let money, dateStr;

    while (true) {
        money = prompt('Ваш бюджет на месяц?', '');
        if (isContainOnlyDigits(money)) {
            break;
        } else {
            alert('Нужно ввести число.');
        }
    }
    money = +money;
    appData.budget = money;

    while (true) {
        dateStr = prompt('Введите дату в формате YYYY-MM-DD', '');
        if (isDate(dateStr)) {
            break;
        } else {
            alert('Нужно ввести дату в формате YYYY-MM-DD.');
        }
    }
    appData.timeData = new Date(dateStr);
    yearValue.value = appData.timeData.getFullYear();
    monthValue.value = appData.timeData.getMonth() + 1;
    dayValue.value = appData.timeData.getDate();

    allDataInputs.forEach( (inp) => {inp.removeAttribute('disabled');} );
    startApp();
    budgetResult.textContent = appData.budget;
     
});

function startApp() {
    allDataButtons.forEach((btn) => {btn.setAttribute('disabled', true);});
    startBtn.removeAttribute('disabled');
    resultValues.forEach( (div) => {div.textContent = '';} );
    allDataInputs.forEach( (inp) => {inp.value = '';} );

    savingsSumInp.setAttribute('disabled', true);
    savingsPercentInp.setAttribute('disabled', true);
    savingsChekbox.checked = false;
}

    // Кнопка Рассчитать (дневной бюджет и уровень дохода)
countBudgetBtn.addEventListener('click', () => {
    let budgetOneDay = 
        (appData.budget == undefined) ? 'Бюджет не задан!' :
        (appData.expenses == {} || expensesResult.textContent == '') ? 'Не заданы обязательные расходы!' :
        Math.round((appData.budget - expensesResult.textContent) / 30);

    dayBudgetResult.textContent = budgetOneDay;

    levelResult.textContent = 
        (budgetOneDay < 500) ? 'Низкий уровень достатка':
        (budgetOneDay < 1500) ? 'Средний уровень достатка':
        (budgetOneDay >= 1500) ? 'Высокий уровень достатка':
        'Бюджет не задан, ошибка!';
});

    // Кнопка Утвердить (обязательные расходы)
expensesBtn.addEventListener('click', () => {
    appData.expenses = {};
    let expensesSum = 0;

    for (let i = 0; i < expensesInps.length; i+=2) {
        let key = expensesInps[i].value,
            value = +expensesInps[i+1].value;
        appData.expenses[key] = value;
        expensesSum += value;
    }
    expensesResult.textContent = expensesSum;
    countBudgetBtn.removeAttribute('disabled');
    console.log('Получены все значения обязательных расходов:');
    console.log(appData.expenses);
});

    // Кнопка Утвердить (НЕобязательные расходы)
optExpensesBtn.addEventListener('click', () => {
    let i = 0;
    appData.optExpense = [];
    optExpensesInps.forEach((item) => {
        let answer = removeNotRussianLetters(item.value, true).trim();
        if (answer != '') {
            appData.optExpense[i] = answer;
            i++;
        }
    });
    optExpensesResult.textContent = (appData.optExpense.length == 0) ? '—' : appData.optExpense.join(' ');
});

    // Навесим на все инпуты для обязательных расходов событие, проверяющее их на правильную заполненность и разблокирующее кнопку Утвердить
for (let i = 0; i < expensesInps.length; i++) {
    if ( i % 2 == 0 ) { // четные инпуты - название расходов
        expensesInps[i].addEventListener('input', (event) =>{
            let key = removeNotRussianLetters(event.target.value).trim();
            event.target.value = key;
            expComplete[i] = (key == null || key == '') ? false : true;
            
            if (verifyDataCompleteness(expComplete, expensesInps.length, true)) {
                expensesBtn.removeAttribute('disabled');
            } else {
                expensesBtn.setAttribute('disabled', true);
            }
            console.log(expComplete);
        });
    } else {    // нечетные инпуты - значение расходов
        expensesInps[i].addEventListener('input', () =>{
            let value = +removeNotDigits(event.target.value);
            if ( value == 0) {
                value = '';
            }
            event.target.value = value;
            expComplete[i] = (value == null || value == '') ? false : true;

            if (verifyDataCompleteness(expComplete, expensesInps.length, true)) {
                expensesBtn.removeAttribute('disabled');
            } else {
                expensesBtn.setAttribute('disabled', true);
            }
            console.log(expComplete);
        });
    }
}

    // Навесим на все инпуты для необязательных расходов событие, проверяющее их на правильную заполненность и разблокирующее кнопку Утвердить
for (let i = 0; i < optExpensesInps.length; i++) {
    optExpensesInps[i].addEventListener('input', (event) => {
        let key = removeNotRussianLetters(event.target.value).trim();
        event.target.value = key;
        
        optExpComplete[i] = (key == null || key == '') ? false : true;
            // нестрогая проверка (не передаем strictly)
        if (verifyDataCompleteness(optExpComplete, optExpensesInps.length)) {
            optExpensesBtn.removeAttribute('disabled');
        } else {
            optExpensesBtn.setAttribute('disabled', true);
        }
        console.log(optExpComplete);
    });
}

    // Инпут - статьи возможного дохода
incomeInp.addEventListener('input', () => {
        // только русские буквы, с учетом запятой и пробела
    let items = removeNotRussianLetters(incomeInp.value, true).trim();
    incomeInp.value = items;
    
    appData.income = (items == '') ? [] : items.split(',');
    incomeResult.textContent = (appData.income.length == 0) ? '—' : appData.income.join('; ');
});

    // Щелканье по чекбоксу Есть ли накопления
savingsChekbox.addEventListener('change', () => {
    appData.savings = savingsChekbox.checked;

    if (appData.savings) {
        savingsSumInp.removeAttribute('disabled');
        savingsPercentInp.removeAttribute('disabled');
    } else {
        savingsSumInp.setAttribute('disabled', true);
        savingsPercentInp.setAttribute('disabled', true);
        appData.savingsSum = undefined;
        appData.savingsPercent = undefined;
        appData.monthIncome = undefined;
        appData.yearIncome = undefined;
    }
    savingsSumInp.value = '';
    savingsPercentInp.value = '';
    setSavingsResult();
});

    // Ввод значений в поле Сумма (накопления)
savingsSumInp.addEventListener('input', () => {
    let savingsSumValue = removeNotDigits(savingsSumInp.value);
    savingsSumInp.value = savingsSumValue;
    
    appData.savingsSum = (savingsSumValue != '') ? savingsSumValue : undefined;
    setSavingsResult();
});

    // Ввод значений в поле Процент (накопления)
savingsPercentInp.addEventListener('input', () => {
    let savingsPercentValue = removeNotDigits(savingsPercentInp.value);
    savingsPercentInp.value = savingsPercentValue;
    
    appData.savingsPercent = (savingsPercentValue != '') ? savingsPercentValue : undefined;
    setSavingsResult();
});

function setSavingsResult() {
    appData.countSavings();
    
    if (appData.savings && appData.savingsSum != undefined && appData.savingsPercent != undefined) {
        monthSavingsResult.textContent = appData.monthIncome.toFixed(2);
        yearSavingsResult.textContent = appData.yearIncome.toFixed(2);
    } else {
        monthSavingsResult.textContent = '—';
        yearSavingsResult.textContent = '—';
    }
}


    /****************************************************************
        Разные вспомогательные функции */

function isNumeric(n) { // проверка является ли строка числом (числами также являются строки вида 1e1, 0x6f и подобные)
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isContainDigit(str) {  // проверка строки на содержание в ней числа
    return /\d/.test(str);
}

function isContainOnlyRussianLetters(str, comma) {  // проверка строки на содержание в ней только русских букв, пробела (и запятой)
    if (str == null || str == '') {
        return false;
    }
    if (comma) {    // с учетом запятой (разделитель)
        return !/[^а-яА-Я ,]/i.test(str);
    } else {
        return !/[^а-яА-Я]/i.test(str); // ^ - кроме, т.е. если там не только руские буквы и пробел, то вернет true (а потом мы его инвертируем)
    }   
}

function isContainOnlyDigits(str) {  // проверка строки на содержание в ней только цифр (?и точки)
    if (str == null || str == '') {
        return false;
    }
    return !/[\D]/gi.test(str);   
}

function removeNotDigits(str, point) {
    return str.replace(/[\D]/gi, '');
}

function removeNotRussianLetters(str, comma) {
    if (comma) {    // с учетом запятой (разделитель)
        return str.replace(/[^а-я,]/gi, '');
    }
    else {
        return str.replace(/[^а-я]/gi, '');
    }
}

function isEmpty(str) { // не пропускаем пустые строки
    return (str == null || str == '');
}
    /* проверка, можно ли получить из строки дату, не проверяет на соответствие календарю. То есть, если ввели '2018-02-30', то дата будет преобразована в '2018-03-02'. Также даже короткие и большие числа могут быть преобразованы в дату, например 10, 50, 23456 и т.д. */
function isDate(str) {  
    if (new Date(str) == 'Invalid Date') {
        return false;
    } else if (str == null || str == '') {
        return false;
    } else {
        return isValidDate(str);
    }
}

    // Проверка даты в целом на существование
function isValidDate(str) {
    let s = str.split('-', 3);
    if (s.length != 3) {
        return false;
    }
    let d = new Date(parseInt(s[0]), parseInt(s[1])-1, parseInt(s[2]));

    if (Object.prototype.toString.call(d) === "[object Date]") 
        { if ((!isNaN(d.getTime())) && (d.getDate() == parseInt(s[2])) && (d.getMonth() == (parseInt(s[1]) - 1))) {
            return true;
        }
    }
    return false;
}

    /* проверяет массив из булевых знаений, strictly - строгая проверка */
function verifyDataCompleteness(obj, len, strictly) {
    let arr = Object.keys(obj).map(function (key) { return obj[key]; });
    if (strictly) {
        if (len != arr.length) {
            return false;
        }
        return arr.every( (item) => {return item == true;});
    } else {
        if (arr.length == 0) {
            return false;
        }
        return arr.some( (item) => {return item == true;});
    }
}
