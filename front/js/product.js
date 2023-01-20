const id = new URLSearchParams(window.location.search).get("id")

document.getElementById("quantity").value = 1

fetch(`http://localhost:3000/api/products/${id}`)
.then (res => res.json())
.then (data => {

    if (typeof data._id === "undefined") {
        document.querySelector('.item').innerHTML = "Le produit n'existe pas"
    } else {
    const imgDiv = document.querySelector(".item__img")
    const img = document.createElement("img")
    img.src = data.imageUrl
    img.alt = data.altTxt
    imgDiv.appendChild(img)

    const name = document.getElementById("title")
    name.textContent = data.name
    
    const price = document.getElementById("price")
    price.textContent = data.price

    const description = document.getElementById("description")
    description.textContent = data.description

    const colors = document.getElementById("colors")
    
    for (let i = 0; i < data.colors.length; i++) {
        let option = document.createElement("option")
        option.value = data.colors[i]
        option.textContent = data.colors[i]
        colors.appendChild(option)
        }
    }
})

const addToCart = document.getElementById("addToCart")

addToCart.addEventListener("click", () =>  {

    const color = document.getElementById("colors").value
    const quantityValue = document.getElementById("quantity").value
    const quantity = parseInt(quantityValue || 0)
    const product = {id: id, color: color, quantity: quantity}

    let itemInLocalStorage = localStorage.getItem("itemArr")
    if (itemInLocalStorage == null) {
        itemInLocalStorage = "[]"
    }
    if (color === "") {
        alert("Veuillez choisir une couleur")
    } else if (quantity <= 0 || quantity > 100 || quantity === null) {
        alert("Veuillez choisir une quantité entre 1 et 100")
        document.getElementById("quantity").value = 1
    } else {
        const itemArr = JSON.parse(itemInLocalStorage)
        const indexOfItem = itemArr.findIndex((Item) => Item.id === id && Item.color === color)
        if (indexOfItem >= 0) {
            const newQuantity = itemArr[indexOfItem].quantity + quantity
            if (newQuantity > 100) {
                document.getElementById("quantity").value = 1
                alert(`Limite de 100 produits maximum, ${itemArr[indexOfItem].quantity} produits dans le panier`)
            } else {
                itemArr[indexOfItem].quantity = newQuantity
            }
        } else {
            itemArr.push(product)
        }
        localStorage.setItem("itemArr", JSON.stringify(itemArr))
    }
})