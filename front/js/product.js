const queryString = new URLSearchParams(window.location.search)
const url = queryString.get("id")

fetch(`http://localhost:3000/api/products/${url}`)
.then (res => res.json())
.then (data => {
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
})

const addToCart = document.getElementById("addToCart")
addToCart.addEventListener("click", () =>  {
    const color = document.getElementById("colors").value
    const quantity = document.getElementById("quantity").value
    const product = {url: url, color: color, quantity: quantity}
    if (localStorage.getItem("itemArr") == null) {
        localStorage.setItem("itemArr", "[]")
    }

    let oldItemArr = JSON.parse(localStorage.getItem("itemArr"))
    oldItemArr.push(product)
    localStorage.setItem("itemArr", JSON.stringify(oldItemArr))
    })
