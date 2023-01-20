let itemArr = JSON.parse(window.localStorage.getItem("itemArr"))
if (itemArr === null) {
    window.localStorage.setItem("itemArr", "[]")
}

reload()

/**
* This function is used to reload the cart items from the local storage and update the cart with the latest data. It fetches the data for each item from the API, updates the item's dataproperty, and calculates the total quantity and price of all items in the cart.
* @returns {Promise} - Returns a promise that resolves with the updated cart items.
*/
function reload() {
    let itemArr = JSON.parse(window.localStorage.getItem("itemArr"))
    if (itemArr.length === 0 ) {
    document.querySelector("#cartAndFormContainer>h1").innerHTML = "Votre panier est vide"
    }

    const fetches = itemArr.map((item) => {
    return fetch(`http://localhost:3000/api/products/${item.id}`)
    .then (res => res.json())
    .then (data => {
    item.data = data
    return item
    })

    })

    return Promise.all(fetches)
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

/**
*
@param {Object} item - Object containing item data, including id, color, quantity, and data.
@param {Number} index - Index of the current item in the array of items.
@returns {HTMLElement} article - An HTML article element representing the item in the cart, containing an image, name, color, price, quantity, and delete button.
*/
function createCartItem(item, index) {
    
    const article = document.createElement("article")
    article.className = "cart__item"
    article.setAttribute("data-id",item.id)
    article.setAttribute("data-color",item.color)
    
    const itemContainer = document.createElement('div')
    itemContainer.className = 'cart__item__img'
    const itemImg = document.createElement('img')
    itemImg.src = item.data.imageUrl
    itemImg.alt = item.data.altTxt
    itemContainer.appendChild(itemImg)
    
    const itemContent = document.createElement('div')
    itemContent.className = 'cart__item__content'
    
    const itemDescription = document.createElement('div')
    itemDescription.className = 'cart__item__content__description'
    const itemName = document.createElement('h2')
    itemName.textContent = item.data.name
    const itemColor = document.createElement('p')
    itemColor.textContent = item.color
    const itemPrice = document.createElement('p')
    itemPrice.textContent = item.data.price
    itemDescription.appendChild(itemName)
    itemDescription.appendChild(itemColor)
    itemDescription.appendChild(itemPrice)
    itemContent.appendChild(itemDescription)
    
    const itemSettings = document.createElement('div')
    itemSettings.className = 'cart__item__content__settings'
    
    const itemQuantity = document.createElement('div')
    itemQuantity.className = 'cart__item__content__settings__quantity'
    const itemQuantityLabel = document.createElement('p')
    itemQuantityLabel.textContent = 'Qté : '
    const itemQuantityInput = document.createElement('input')
    itemQuantityInput.type = 'number'
    itemQuantityInput.className = 'itemQuantity'
    itemQuantityInput.id = `itemQuantity-${index}`
    itemQuantityInput.name = 'itemQuantity'
    itemQuantityInput.min = 1
    itemQuantityInput.max = 100
    itemQuantityInput.value = item.quantity
    itemQuantity.appendChild(itemQuantityLabel)
    itemQuantity.appendChild(itemQuantityInput)
    itemSettings.appendChild(itemQuantity)
    
    const itemDelete = document.createElement('div')
    itemDelete.className = 'cart__item__content__settings__delete'
    const deleteItem = document.createElement('p')
    deleteItem.className = 'deleteItem'
    deleteItem.id = `deleteItem-${index}`
    deleteItem.textContent = 'Supprimer'
    itemDelete.appendChild(deleteItem)
    itemSettings.appendChild(itemDelete)
    
    itemContent.appendChild(itemSettings)
    
    article.appendChild(itemContainer)
    article.appendChild(itemContent)
    
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

/**
 * Removes a product from the cart based on its id and color.
 * @param {string} itemid - The id of the item to be removed.
 * @param {string} itemColor - The color of the item to be removed.
 */
function deleteProductInCart(itemid, itemColor) {
    let array = JSON.parse(window.localStorage.getItem("itemArr"))
    array = array.filter((item) => {
        return item.id !== itemid || item.color !== itemColor
    })
    window.localStorage.setItem("itemArr", JSON.stringify(array))
}


/**
* Calculate the total quantity of items in the cart
* @param {Array} item - An array of items, each containing a quantity property
* @returns {Number} - The total quantity of all items in the cart
*/
function totalQty (item) {
    const sum = item.reduce((accumulator, object) => {
    return accumulator + object.quantity
    }, 0)
    document.getElementById("totalQuantity").innerText = sum
}

/**
* Calculate the total price of the items in the cart
* @param {Array} item - An array of items, each containing a quantity and data object with price information
* @returns {Number} - The total price of all items in the cart
*/
function totalPrice (item) {
    const sum = item.reduce((accumulator, object) => {
    return accumulator + (object.quantity * object.data.price)
    }, 0)
    document.getElementById("totalPrice").innerText = sum
}

const firstName = document.getElementById('firstName')
const firstNameError = document.getElementById('firstNameErrorMsg')

/**
* Check if the input first name is valid
* @param {HTMLInputElement} elt - The input element containing the first name to be checked
* @param {HTMLElement} eltError - The element that will display an error message if the first name is not valid
* @param {RegExp} regex - The regular expression to match the first name against
* @returns {string} - The value of the first name input if it is valid, otherwise an empty string and an error message is displayed.
*/
function checkFisrtName (elt, eltError, regex) {
    if (regex.test(elt.value) === false) {
    elt.value = ""
    eltError.innerHTML = "Veuillez entrer un prénom valide"
    } else {
    eltError.innerHTML = ""
    return elt.value
    }
}

const lastName = document.getElementById('lastName')
const lastNameError = document.getElementById('lastNameErrorMsg')
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/

/**
* Check if the input last name is valid
* @param {HTMLInputElement} elt - The input element containing the last name to be checked
* @param {HTMLElement} eltError - The element that will display an error message if the last name is not valid
* @param {RegExp} regex - The regular expression to match the last name against
* @returns {string} - The value of the last name input if it is valid, otherwise an empty string and an error message is displayed.
*/
function checkLastName (elt, eltError, regex) {
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
const regexAddress = /^[0-9]+[a-zA-Z\s,-]+$/

/**
* Check if the input address is valid
* @param {HTMLInputElement} elt - The input element containing the address to be checked
* @param {HTMLElement} eltError - The element that will display an error message if the address is not valid
* @param {RegExp} regex - The regular expression to match the address against
* @returns {string} - The value of the address input if it is valid, otherwise an empty string and an error message is displayed.
*/
function checkAddress (elt, eltError, regex) {
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
const regexCity = /^[a-zA-Z\s,-]+$/

/**
* Check if the input city is valid
* @param {HTMLInputElement} elt - The input element containing the city to be checked
* @param {HTMLElement} eltError - The element that will display an error message if the city is not valid
* @param {RegExp} regex - The regular expression to match the city against
* @returns {string} - The value of the city input if it is valid, otherwise an empty string and an error message is displayed.
*/
function checkCity (elt, eltError, regex) {
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
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
* Check if the input email is valid
* @param {HTMLInputElement} elt - The input element containing the email to be checked
* @param {HTMLElement} eltError - The element that will display an error message if the email is not valid
* @param {RegExp} regex - The regular expression to match the email against
* @returns {string} - The value of the email input if it is valid, otherwise an empty string and an error message is displayed.
*/
function checkEmail (elt, eltError, regex) {
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
            return
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
            confirmUrl = "./confirmation.html?id=" + data.orderId
            localStorage.removeItem('itemArr')
            window.location.href = confirmUrl
        })
    }
})

/**
* This function takes an input array and removes duplicate elements from it using the Set object. It then converts the set back to an array using the Array.from() method and returns the resulting array.
* @param {Array} array - The input array
* @returns {Array} - Returns an array with duplicate elements removed
*/
function removeDuplicates(array) {
    return Array.from(new Set(array))
    }