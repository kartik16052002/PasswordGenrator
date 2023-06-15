const num = document.querySelector(".data-lenghtNum");
const slider = document.querySelector("[data-lengthSlider]");
const finalPassword = document.querySelector("[data-passwordDisplay]");
const indicator = document.querySelector("[data-indicator]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn  = document.querySelector("[data-copy]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const genBtn = document.querySelector(".generateButton");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
// initial setup
let checkCount = 0;
let password = "";
let passwordLength = 10;
const symbols = "!@#$%^&*(){}[]`~-=+_/|";
changeLength();

console.log(symbols.length);
function changeLength(){
    slider.value = passwordLength;
    num.innerHTML = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRndInt(min,max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function genrateNumber(){
    return getRndInt(0,9);
}
function genrateLowerCase(){
    return String.fromCharCode(getRndInt(97,123));
}
function genrateUpperCase(){
    return String.fromCharCode(getRndInt(65,91));
}
function genrateSymbol(){
    let rndNum = getRndInt(0,symbols.length);
    return symbols.charAt(rndNum);
}


slider.addEventListener("input",() => {
    passwordLength = slider.value;
    changeLength();
})

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(finalPassword.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Not Copied";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

copyBtn.addEventListener("click",() => {
    if(finalPassword.value){
        copyContent();
    }
})

function handleCheckBox(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;

        if(passwordLength < checkCount){
            passwordLength = checkCount;
            changeLength();
        }
    })
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBox);
})



genBtn.addEventListener("click",() => {
    if(passwordLength <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        changeLength();
    }

    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(genrateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(genrateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(genrateNumber);

    if(symbolsCheck.checked)
        funcArr.push(genrateSymbol);

    // compulsory addition
    for(let i =0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    
    // remaining addition 

    for(let i=0; i<passwordLength-funcArr.length;i++){
        let rNum = getRndInt(0,funcArr.length);
        password += funcArr[rNum]();
    }

    password = shufflePassword(Array.from(password));
    finalPassword.value = password;

    calcStrength();


});