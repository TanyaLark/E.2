/*
    В соответствии с https://uk.wikipedia.org/wiki/Реєстраційний_номер_облікової_картки_платника_податків
*/
const inputINN = 3463463460;//2063463479;

function parseINN(inn) {

    inn = inn
        .toString() // Преобразование в строку, на случай если код был передан числом.
        .replaceAll(' ', '') // Очистка от пробелов (не лучший вариант).
        .split('')
        .map(i => +i) // Преобразуем все цифры из строк в числа.
        .filter(item => !isNaN(item)); // Все НЕ цифры после преобразования станут NaN'ами, и тут мы их фильтруем. Т.е. если пользователь введёт случайно буквы, мы очистим от них введённую строку. 

    let coefficients = [-1, 5, 7, 9, 4, 6, 10, 5, 7]; // Коэфициенты. 

    let controlSum = coefficients.reduce((acc, item, i) => acc + item * inn[i], 0); // Находим контрольную сумму, перемножая соответствующие элементы массива с цифрами ИНН'а и коэфициентами, и суммируем полученные произведения. 
    // В соответствии с Х = А*(-1) + Б*5 + В*7 + Г*9 + Ґ*4 + Д*6 + Е*10 + Є*5 + Ж*7.

    controlSum = (controlSum % 11) % 10; // В соответствии с З = MOD(MOD(X;11);10).

    const resultObject = { // Подготовим объект для возврата результатов.
        code: inn.join(''),
        isCorrect: controlSum === inn[inn.length - 1] // Установим флаг корректности.
    }

    if (resultObject.isCorrect) {
        resultObject.sex = inn[inn.length - 2] % 2 === 0 ? 'female' : 'male'; // Если код корректен, то определяем пол.

        // Первые пять цифр кодируют дату рождения владельца номера — как правило, это пятизначное число представляет 
        // собой количество дней от 31 декабря 1899   года до даты рождения человека.

        let INNdays = +resultObject.code
             .slice(0, 5);//к-во дней от 31.12.1899 до даты рождения пользователя
             let result = new Date (1900, 0, INNdays);
             let year = result.getUTCFullYear();
             let month = 1 + result.getUTCMonth();
             let day = 1 + result.getUTCDate();
             if (month < 10){
                 month = "0" + month;
             }
             if (day < 10){
                day = "0" + day;
            }
             let dateOfBirthString = `${year}-${month}-${day}`; // дата рождения
             resultObject.dateOfBirth = dateOfBirthString;
             let today = new Date();//текущая дата
             let fullYearsNum = today.getUTCFullYear() - year;//сколько полных лет человеку
             resultObject.fullYears = `${fullYearsNum}`;
    }

    return resultObject;
}


console.log("Результат ф-ции parseINN(inn)", parseINN(inputINN));

    (function(){

        //******************** Test Case #01 *************************//

        let controlCode_01 = '2063463479'; //Correct, Male, 1956-06-29
        let controlResult_01 = parseINN(controlCode_01);

        console.assert(controlResult_01.code === controlCode_01, 'Check Code #01 Coincidence: FAIL'); //Проверяем совпадает ли переданный код с полученным в результирующем объекте.
        console.assert(controlResult_01.isCorrect, 'Check Code #01 isCorrect: FAIL'); //Проверяем флаг корректности кода.
        console.assert(controlResult_01.sex === 'male', 'Check Code #01 sex: FAIL'); //Проверяем корректность пола.
        console.assert(controlResult_01.dateOfBirth === '1956-06-29', 'Check Code #01 dateOfBirth: FAIL'); //Проверяем корректность даты рождения.
        console.assert(controlResult_01.fullYears === '64', 'Check Code #01 fullYears: FAIL'); //Проверяем количество полных лет.


        //******************** Test Case #02 *************************//

        let controlCode_02 = '3463463460'; //Correct, Female, 1994-10-28
        let controlResult_02 = parseINN(controlCode_02);

        console.assert(controlResult_02.code === controlCode_02, 'Check Code #02 Coincidence: FAIL');
        console.assert(controlResult_02.isCorrect, 'Check Code #02 isCorrect: FAIL');
        console.assert(controlResult_02.sex === 'female', 'Check Code #02 sex: FAIL');
        console.assert(controlResult_02.dateOfBirth === '1994-10-28', 'Check Code #02 dateOfBirth: FAIL');
        console.assert(controlResult_02.fullYears === '26', 'Check Code #02 fullYears: FAIL'); //Проверяем количество полных лет.


         //******************** Test Case #03 *************************//

         let controlCode_03 = '4564def57437 89abc'; //Некорректный код.
         let controlResult_03 = parseINN(controlCode_03);

         console.assert(!controlResult_03.isCorrect, 'Check Ivalid Code #03 isCorrect: FAIL'); //Проверяем на некорректном коде, возвращается ли false.


    })();

