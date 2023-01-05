const id = new URLSearchParams(window.location.search).get("id")

fetch(`http://localhost:3000/api/products/${id}`)
.then (res => res.json())
.then (data => {

    if (typeof data._id === "undefined") {
        document.querySelector('.item').innerHTML = "Le produit n'existe pas"
    } else {
    let img = document.getElementsByClassName("item__img")[0];
    img.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`

    let name = document.getElementById("title");
    name.innerHTML = data.name
    
    let price = document.getElementById("price");
    price.innerHTML = data.price

    let description = document.getElementById("description");
    description.innerHTML = data.description

    let colors = document.getElementById("colors");
    let myHTML = `<option value="">--SVP, choisissez une couleur --</option>`

    for (let i = 0; i < data.colors.length; i++) {
        myHTML += 
        `<option value="${data.colors[i]}">${data.colors[i]}</option>`
    }

    colors.innerHTML = myHTML
}
})

const addToCart = document.getElementById("addToCart")

addToCart.addEventListener("click", () =>  {

    const color = document.getElementById("colors").value
    const quantityValue = document.getElementById("quantity").value
    const quantity = parseInt(quantityValue || 0)
    const product = {id: id, color: color, quantity: quantity}

    let iteminLocalStorage = localStorage.getItem("itemArr");
    if (iteminLocalStorage == null) {
        iteminLocalStorage = "[]"
    }
    if (color == "") {
        alert("Veuillez choisir une couleur")
    } else if (quantity <= 0 || quantity > 100 || quantity === null) {
        alert("Veuillez choisir une quantité entre 1 et 100")
    } else {
        const itemArr = JSON.parse(iteminLocalStorage)
        const indexOfItem = itemArr.findIndex((cartItem) => cartItem.id == id && cartItem.color == color)
        console.log(indexOfItem)
        if (indexOfItem >= 0) {
            let newQuantity = itemArr[indexOfItem].quantity + quantity 
            if (newQuantity > 100) {
                alert("Limite de 100 produits atteint")
            } else {
                itemArr[indexOfItem].quantity = newQuantity
            }
        } else {
            itemArr.push(product)
        }
        localStorage.setItem("itemArr", JSON.stringify(itemArr))
    }
})