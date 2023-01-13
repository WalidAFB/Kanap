let itemArr = JSON.parse(window.localStorage.getItem("itemArr"))
if (itemArr === null) {
    window.localStorage.setItem("itemArr", "[]")
}

reload()

// call or recall all the promises and display the result with the createCartItem function
function reload() {
    let itemArr = JSON.parse(window.localStorage.getItem("itemArr"))
    if (itemArr.length === 0 ) {
        document.querySelector("#cartAndFormContainer>h1").innerHTML = "Votre panier est vide"
    }

    const fetches = itemArr.map((item) => {
        return fetch(`http://localhost:3000/api/products/${item.id}`)
            .then (res => res.json())
            .then (data =>  {
            item.data = data
            return item
            })
            
    })

    Promise.all(fetches)
    .then((items) => {
        let itemCart = document.getElementById("cart__items")
        itemCart.innerHTML = ""
        let cartItems = items.map((item, index) => { 
            return createCartItem(item, index) 
        })
        cartItems.forEach(item => itemCart.appendChild(item))

        totalQty(items)
        totalPrice(items)
    })
}

// Create the html part for each items called in reload function
function createCartItem(item, index) {
    
    const article = document.createElement("article")
    article.className = "cart__item"
    article.setAttribute("data-id",item.id)
    article.setAttribute("data-color",item.color)
    article.innerHTML = ` 
        <div class="cart__item__img">
            <img src="${item.data.imageUrl}" alt="${item.data.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${item.data.name}</h2>
                <p>${item.color}</p>
                <p>${item.data.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" id="itemQuantity-${index}" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" id="deleteItem-${index}">Supprimer</p>
                </div>
            </div>
        </div>`;
        
    article.querySelector(`#deleteItem-${index}`).addEventListener("click", () => {
        deleteProductInCart(item.id, item.color)
        reload()
    })

    article.querySelector(`#itemQuantity-${index}`).addEventListener("change", (event) => {
        let array = JSON.parse(window.localStorage.getItem("itemArr"))
        const indexOfItem = array.findIndex((cartItem) => cartItem.id == item.id && cartItem.color == item.color)
        const quantityValue = document.getElementById(`itemQuantity-${index}`).value
        const newQuantity = parseInt(quantityValue || 0)
        if (newQuantity === null || newQuantity > 100 || newQuantity <= 0) { 
            alert("Veuillez choisir une quantité entre 1 et 100")
            document.getElementById(`itemQuantity-${index}`).value = array[indexOfItem].quantity
        } else {
            array[indexOfItem].quantity = newQuantity
            localStorage.setItem("itemArr", JSON.stringify(array))
            reload()
        }
    })
    return article
}

// return an array without the product clicked in createCartItem function
function deleteProductInCart(itemid, itemColor) {
    var array = JSON.parse(window.localStorage.getItem("itemArr"));
    array = array.filter((item) => {
        return item.id !== itemid || item.color !== itemColor
    })
    window.localStorage.setItem("itemArr", JSON.stringify(array))
}

// return and display the sum of the item quantity
function totalQty (item) {
    const sum = item.reduce((accumulator, object) => {
        return accumulator + object.quantity;
        }, 0);
            document.getElementById("totalQuantity").innerText = sum
        }

// return and display the sum of the price multiplied by their item quantity
function totalPrice (item) {
    const sum = item.reduce((accumulator, object) => {
        return accumulator + (object.quantity * object.data.price);
        }, 0);
        document.getElementById("totalPrice").innerText = sum
}

const firstName = document.getElementById('firstName')
const firstNameError = document.getElementById('firstNameErrorMsg')

// check if the input value is empty, check if the value match the regex, if false, display an error message, if true, return the checked value
function checkFisrtName (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "Veuillez remplir le champ";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer un prénom valide"
    } else {
        return elt.value
    }
}

const lastName = document.getElementById('lastName')
const lastNameError = document.getElementById('lastNameErrorMsg')
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;

// check if the input value is empty, check if the value match the regex, if false, display an error message, if true, return the checked value
function checkLastName (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer un nom valide"
    } else {
        eltError.innerHTML = ""
        return elt.value
    } 
}

const address = document.getElementById('address')
const addressError = document.getElementById('addressErrorMsg')
const regexAddress = /^[0-9]+[a-zA-Z\s,-]+$/;

// check if the input value is empty, check if the value match the regex, if false, display an error message, if true, return the checked value
function checkAddress (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer une adresse valide"
    } else {
        eltError.innerHTML = ""
        return elt.value
    } 
}

const city = document.getElementById('city')
const cityError = document.getElementById('cityErrorMsg')
const regexCity = /^[a-zA-Z\s,-]+$/;

// check if the input value is empty, check if the value match the regex, if false, display an error message, if true, return the checked value
function checkCity (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer une ville valide"
    } else {
        eltError.innerHTML = ""
        return elt.value
    } 
}

const email = document.getElementById('email')
const emailError = document.getElementById('emailErrorMsg')
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// check if the input value is empty, check if the value match the regex, if false, display an error message, if true, return the checked value
function checkEmail (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer une adresse mail valide"
    } else {
        eltError.innerHTML = ""
        return elt.value
    } 
}

const submitBtn = document.getElementById('order')

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    product = JSON.parse(window.localStorage.getItem("itemArr"))

    if (product.length === 0) {
        alert("Votre panier est vide")
    } else {
        const firstNameValue = checkFisrtName(firstName, firstNameError, regexName)
        const lastNameValue = checkLastName(lastName, lastNameError, regexName)
        const addressValue = checkAddress(address, addressError, regexAddress)
        const cityValue = checkCity(city, cityError, regexCity)
        const emailValue = checkEmail(email, emailError, regexEmail)

        const contact = {
            firstName : firstNameValue,
            lastName : lastNameValue,
            address : addressValue,
            city : cityValue,
            email : emailValue
        }

        const productsValue = product.map(element => element.id)
        const products = removeDuplicates(productsValue)

        if (!firstNameValue || !lastNameValue || !addressValue || !cityValue || !emailValue) {
            return;
        }

        postData = JSON.stringify({contact, products})
        
        fetch('http://localhost:3000/api/products/order', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: postData
        })
        .then((res) => res.json())
        .then((data) => {
            confirmUrl = "./confirmation.html?id=" + data.orderId;
            localStorage.removeItem('itemArr')
            window.location.href = confirmUrl;
        })
    }
})

// removes the duplicates values of an Array
function removeDuplicates(array) {
    return Array.from(new Set(array));
}