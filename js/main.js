//---------------------------------------> variable <---------------------------------------------------------------------
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
let productListBox=document.querySelector('.productListBox');
const clearListButton=document.querySelector('.clearList');
const refreshListButton=document.querySelector('.refreshList');



//----------------------------------------> function <------------------------------------------------------------------
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
        //console.log(data);
        return data
    })
}

async function addProductToList(inputProductName,inputDescription){
    let product={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: inputProductName,
            description: inputDescription,
        })}
    if(!(inputProductName==="")){
        await fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist/new",product)
    }

}

async function displayProduct() {
    productListBox.innerHTML = "";
    let arrayProducts = await listProducts();

    arrayProducts.forEach((element) => {
        let card = document.createElement("div");
        card.classList.add("d-flex", "flex-column", "cardDesign");

        let name = document.createElement("span");
        name.classList.add("nameDesign");
        name.innerText = element.name;

        let description = document.createElement("span");
        description.classList.add("descriptionDesign");
        description.innerText = element.description;

        let statusText = element.status === "false" ? "waiting" : "bought";

        let buttonStatusProduct = document.createElement('button');
        buttonStatusProduct.setAttribute("type", "button");
        buttonStatusProduct.setAttribute("id", `${element.id}`);
        buttonStatusProduct.classList.add("statusButton");
        buttonStatusProduct.classList.add("rounded")
        buttonStatusProduct.classList.add("text-white")
        buttonStatusProduct.classList.add("fw-bold")
        buttonStatusProduct.classList.add("p-1")
        buttonStatusProduct.textContent = statusText;

        buttonStatusProduct.addEventListener("click", async () => {
            console.log(element.status);
            await changeStatus(element.id);
            await displayProduct();
        });

        let buttonDeleteProduct = document.createElement('button');
        buttonDeleteProduct.setAttribute("type", "button");
        buttonDeleteProduct.setAttribute("id", `${element.id}`);
        buttonDeleteProduct.classList.add("deleteButtonProduct");
        buttonDeleteProduct.classList.add("bg-danger");
        buttonDeleteProduct.classList.add("text-white");
        buttonDeleteProduct.classList.add("fw-bold");
        buttonDeleteProduct.classList.add("rounded");
        buttonDeleteProduct.textContent = "Delete";
        buttonDeleteProduct.addEventListener("click", () => {
            deleteThisProduct(element.id);
        });

        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(buttonStatusProduct);
        card.appendChild(buttonDeleteProduct);
        productListBox.appendChild(card);
    });
}

async function clearList(){
    let productListBox=document.querySelector('.productListBox');
    productListBox.innerHTML="";
    let autho={
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        }
    await fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist/clear",autho)
    displayProduct()
}

async function deleteThisProduct(element){
    let autho={
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }}
    await fetch(`https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist/delete/${element}`,autho)
    await displayProduct()
}

async function changeStatus(element){
    let author={
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }}
    await fetch(`https://partiel-s1-b1dev-2425.esdlyon.dev/api/mylist/switchstatus/${element}`,author)
    await displayProduct()
}


//--------------------------------------> addEvent <------------------------------------------------------------------
signUpButton.addEventListener('click',()=>{
    let username=document.querySelector('.inputUsernameSignUp');
    let password=document.querySelector('.inputPasswordSignUp');
    let requestSignup={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
        })
    }
    fetch("https://partiel-s1-b1dev-2425.esdlyon.dev/api/register",requestSignup)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            displaylogIn()
        })
    username.value= "";
    password.value= "";
})

alreadyAccount.addEventListener('click',()=>{
    displaylogIn()
})

loginButton.addEventListener('click',()=>{
    let usernameLogin=document.querySelector('.inputUsernameLogIn');
    let passwordLogin=document.querySelector('.inputPasswordLogIn');
    console.log("ok ici")
    logIn(usernameLogin.value, passwordLogin.value).then((data) => {
        token = data
        if(!(token===null||token===undefined)){
            console.log(token)
            displayList()
            displayProduct()
        }
    })
    usernameLogin.value= "";
    passwordLogin.value= "";
})

addProductButton.addEventListener('click',()=>{
    addBox.style.display="flex";
})

addProductFinished.addEventListener('click',()=>{
    let inputProductName=document.querySelector('.inputProductName').value;
    let inputDescription=document.querySelector('.inputDescription').value;
    addProductToList(inputProductName,inputDescription)
    displayProduct()
    addBox.style.display="none";
    inputProductName.value=""
    inputDescription.value=""
})

clearListButton.addEventListener('click',()=>{
    clearList();
})

refreshListButton.addEventListener('click',()=>{
    displayProduct()
})