//-->variable
const signUpButton=document.querySelector('.signUpButton');
const signUpBox=document.querySelector('.signUpBox');
const logInBox=document.querySelector('.logInBox');
const alreadyAccount=document.querySelector('.alreadyAccount');
const loginButton=document.querySelector('.loginButton');
const listPage=document.querySelector('.listPage');
const addProductButton=document.querySelector('.addProduct');
let token=null
const addBox=document.querySelector('.addBox');
const addProductFinished=document.querySelector('.addProductFinished');
const productListBox=document.querySelector('.productListBox');

//--> function
function displaylogIn(){
    signUpBox.style.display="none";
    logInBox.style.display="flex"
}

async function logIn(usernameLogin,passwordLogin){
    let loginInfo={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usernameLogin,
            password: passwordLogin,
        })
    }
    return await fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/login",loginInfo)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return token=data.token

        })
}

async function displayList(){
    logInBox.style.display="none";
    listPage.style.display="flex";
}

async function listProducts(){
    let autho={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return await fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist", autho)
    .then(response => response.json())
    .then(data => {
        return data
    })
}

function addProductToList(inputProductName,inputDescription){
    product={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: inputProductName,
            description: inputDescription,
        })}
    fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist/new",product)
}

async function displayProduct(){
    arrayProducts= await listProducts();
    arrayProducts.forEach(element => {
        card=document.createElement("div");
    })
}

//-->addEvent
signUpButton.addEventListener('click',()=>{
    let username=document.querySelector('.inputUsernameSignUp').value;
    let password=document.querySelector('.inputPasswordSignUp').value;
    let requestSignup={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }
    fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/register",requestSignup)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            displaylogIn()
        })
})

alreadyAccount.addEventListener('click',()=>{
    displaylogIn()
})

loginButton.addEventListener('click',()=>{
    let usernameLogin=document.querySelector('.inputUsernameLogIn').value;
    let passwordLogin=document.querySelector('.inputPasswordLogIn').value;
    console.log("ok ici")
    logIn(usernameLogin, passwordLogin).then((data) => {
        token = data
        if(!(token===null||token===undefined)){
            console.log(token)
            displayList()
        }
    })
})

addProductButton.addEventListener('click',()=>{
    addBox.style.display="flex";
})

addProductFinished.addEventListener('click',()=>{
    let inputProductName=document.querySelector('.inputProductName').value;
    let inputDescription=document.querySelector('.inputDescription').value;
    addProductToList()
    displayProduct()
})

