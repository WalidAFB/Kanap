fetch("http://localhost:3000/api/products")
    .then (res => res.json())
    .then (data => {
        let items = document.getElementById("items")
        data.forEach(data => {
            let a = document.createElement("a");
            a.href = `./product.html?id=${data._id}`;
            let article = document.createElement("article");
            let img = document.createElement("img");
            img.src = data.imageUrl;
            img.alt = data.altTxt;
            let h3 = document.createElement("h3");
            h3.className = "productName";
            h3.textContent = data.name;
            let p = document.createElement("p");
            p.className = "productDescription";
            p.textContent = data.description;

            article.appendChild(img);
            article.appendChild(h3);
            article.appendChild(p);
            a.appendChild(article);
            items.appendChild(a);
        })
    })