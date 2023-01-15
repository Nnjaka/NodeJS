import colors from 'colors';

function isNumber(num) {
	return typeof num === 'number' && !isNaN(num);
}

function checkColors(numbers){
    let step = 1;

    for(let i = 0; i < numbers.length; i++){
        printNumbersWithColors(step, numbers[i]);
        if(step === 3){
            step = 1;
        } else {
            step++;
        }
    }
}

function printNumbersWithColors(step, number){
    switch (step) {
        case 1: 
            console.log(colors.red(number));
            break;
        case 2:
            console.log(colors.yellow(number));
            break;
        case 3:
            console.log(colors.green(number));
            break
    }
}

function getSimpleNumbers(firstNumber, lastNumber){
    if (isNumber(firstNumber) && isNumber(lastNumber)){
        let numbers = [];
        let stopСhecking = false;

        for (let i = firstNumber; i <= lastNumber; i++) {
                for (let j = 2; (j <= i/2); j++) {
                    if (i % j == 0) {
                        stopСhecking = true;
                        break;
                    }
                    stopСhecking = false;
                }
                if (!stopСhecking && i > 0 && i != 1) {
                    numbers.push(i);
                }
        }
        if(numbers.length == 0){
            console.log('В диапазоне отсутсвуют простые числа');
        } else {
            return checkColors(numbers);
        }
    } else {
        console.log('Одно из чисел не является числом');
    }
}

const [firstNumber, lastNumber] = process.argv.slice(2);

let numbers = getSimpleNumbers(parseInt(firstNumber), parseInt(lastNumber));