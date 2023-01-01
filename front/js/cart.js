reload()

function reload() {
    let itemArr = JSON.parse(window.localStorage.getItem("itemArr")) || [];
    itemArr = itemArr.sort((a, b) => {
        if (a.url < b.url) {
            return -1;
        }
    });

    const fetches = itemArr.map((item) => {
        return fetch(`http://localhost:3000/api/products/${item.url}`)
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

function createCartItem(item, index) {
    
    const article = document.createElement("article")
    article.className = "cart__item"
    article.setAttribute("data-id",item.url)
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
        deleteProductInCart(item.url, item.color)
        reload()
    })

    article.querySelector(`#itemQuantity-${index}`).addEventListener("change", () => {
        var array = JSON.parse(window.localStorage.getItem("itemArr"));
        const indexOfItem = array.findIndex((cartItem) => cartItem.url == item.url && cartItem.color == item.color)
        if (indexOfItem >= 0) {
            array[indexOfItem].quantity = parseInt(document.getElementById(`itemQuantity-${index}`).value)
        }
        if (array[indexOfItem].quantity > 100 || array[indexOfItem].quantity <= 0) {
            alert("Veuillez choisir une quantité entre 1 et 100")
        } else {
            localStorage.setItem("itemArr", JSON.stringify(array))
        }
        reload()
    })
    return article
}

function deleteProductInCart(itemUrl, itemColor) {
    var array = JSON.parse(window.localStorage.getItem("itemArr"));
    array = array.filter((item) => {
        return item.url !== itemUrl || item.color !== itemColor
    })
    window.localStorage.setItem("itemArr", JSON.stringify(array))
}

function totalQty (array) {
    const sum = array.reduce((accumulator, object) => {
        return accumulator + object.quantity;
        }, 0);
            document.getElementById("totalQuantity").innerText = sum
        }

function totalPrice (array) {
    const sum = array.reduce((accumulator, object) => {
        return accumulator + (object.quantity * object.data.price);
        }, 0);
        document.getElementById("totalPrice").innerText = sum
}

// form

const firstName = document.getElementById('firstName')
const firstNameError = document.getElementById('firstNameErrorMsg')

const lastName = document.getElementById('lastName')
const lastNameError = document.getElementById('lastNameErrorMsg')
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;

const address = document.getElementById('address')
const addressError = document.getElementById('addressErrorMsg')
const regexAddress = /^[0-9]+[a-zA-Z\s,-]+$/;

const city = document.getElementById('city')
const cityError = document.getElementById('cityErrorMsg')
const regexCity = /^[a-zA-Z\s,-]+$/;

const email = document.getElementById('email')
const emailError = document.getElementById('emailErrorMsg')
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Get the submit button element
const submitBtn = document.getElementById('order')

// Add a click event listener to the submit button
submitBtn.addEventListener("click", (e) => {
    // Prevent the default action of the submit button (e.g. submitting a form)
    e.preventDefault()

    // Get the product array from local storage
    product = JSON.parse(window.localStorage.getItem("itemArr"))

    // Check if the product array is empty
    if (product.length === 0) {
        // Prevent the default action if the product array is empty
        e.preventDefault()
        // Display an alert to the user
        alert("Votre panier est vide")
    } else {
        // Get the first name value and check if it is valid
        const firstNameValue = checkFisrtName(firstName, firstNameError, regexName)
        // Get the last name value and check if it is valid
        const lastNameValue = checkLastName(lastName, lastNameError, regexName)
        // Get the address value and check if it is valid
        const addressValue = checkAddress(address, addressError, regexAddress)
        // Get the city value and check if it is valid
        const cityValue = checkCity(city, cityError, regexCity)
        // Get the email value and check if it is valid
        const emailValue = checkEmail(email, emailError, regexEmail)

        // Create the contact object with the valid values
        const contact = {
            firstName : firstNameValue,
            lastName : lastNameValue,
            address : addressValue,
            city : cityValue,
            email : emailValue
        }

        // Check if any of the fields in the contact object are invalid (i.e. falsy values)
        if (!firstNameValue || !lastNameValue || !addressValue || !cityValue || !emailValue) {
            // Return if the contact object is invalid
            return;
        }

        // Get the unique product IDs
        const productsValue = getIdValues(product)
        const products = removeDuplicates(productsValue)

        // Stringify the contact and products objects for the POST request
        postData = JSON.stringify({contact, products})
        
        // Make a POST request to the server with the contact and products data
        fetch('http://localhost:3000/api/products/order', {
            method: "POST", // Set the request method to POST
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
            body: postData // Set the request body to the stringified data
        })
        // Parse the response as JSON
        .then((res) => res.json())
        // Use the response data to redirect the user to the confirmation page
        .then((data) => {
            // Clear the local storage
            localStorage.clear();
            // Create the confirmation URL with the order ID
            let confirmationUrl = "./confirmation.html?id=" + data.orderId;
            // Redirect the user to the confirmation page
            window.location.href = confirmationUrl;
        })
    }
})



function checkFisrtName (elt, eltError, regex) {
    if (elt.value === "") {
        eltError.innerHTML = "";
        return;
    }
    if (regex.test(elt.value) === false) {
        elt.value = ""
        eltError.innerHTML = "Veuillez entrer un prénom valide"
    } else {
        return elt.value
    }
}

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

function getIdValues(objectsArray) {
    idValues = [];
    for (let item of objectsArray) {
    idValues.push(item.url);
    }
    return idValues;
}

function removeDuplicates(array) {
    return Array.from(new Set(array));
}