fetch("http://localhost:3000/api/products")
    .then (res => res.json())
    .then (data => {
        let items = document.getElementById("items")
        let productsList = ""
        data.forEach(item => {
            productsList += 
                `<a href="./product.html?id=${item._id}">
                <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}">
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article>
                </a>`
        });
        items.innerHTML = productsList
    });

