fetch("http://localhost:3000/api/products")
    .then (res => res.json())
    .then (data => {
        let items = document.getElementById("items")
        let product = ""
        data.forEach(data => {
            product += 
                `<a href="./product.html?id=${data._id}">
                <article>
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                    <h3 class="productName">${data.name}</h3>
                    <p class="productDescription">${data.description}</p>
                </article>
                </a>`
        });
        items.innerHTML = product
    });

