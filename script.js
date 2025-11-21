document.addEventListener("DOMContentLoaded", ()=>{
    const addToCartButton = document.querySelector(".add-to-cart"); //makes sure script is running after HTML is loaded on the browser


    if (addToCartButton){        
        addToCartButton.addEventListener("click", ()=>{
            const productId = addToCartButton.dataset.productId;  //productId and price from the button 
            const price = parseFloat(addToCartButton.dataset.price)


            const colorSelect = document.getElementById("color"); 
            const sizeSelect = document.getElementById("size"); 

            const color = colorSelect? colorSelect.value: null;  //color and size from the selects 
            const size = sizeSelect? sizeSelect.value: null; 

            //cart item to save our data local
            const item  = {
                id: productId, 
                price: price, 
                color: color, 
                size: size, 
                quantity: 1
            }; 

            //loading existing cart from storage or starting empty cart  
            const existingCart = JSON.parse(localStorage.getItem("cart")) || []; 
            existingCart.push(item) //adding item to array 

            localStorage.setItem("cart", JSON.stringify(existingCart)); //saving to storage as a string. 

            updateCartCount(); 

            //window.location.href = "../cart.html"; // this will take us to cart.html page (I dont to  anymore)
        });

    }


    const cartItems = document.getElementById("cart-items"); 
    const cartTotal = document.getElementById("cart-total"); 
    const cartEmpty = document.getElementById("cart-empty");
    
    if (cartItems && cartEmpty && cartTotal){
        const cart = JSON.parse(localStorage.getItem("cart"))||[];
       if (cart.length === 0){
        cartEmpty.style.display = "block"; 
        cartItems.innerHTML = ""; 
        cartTotal.textContent = "$0.00"; 
        return;
       }
       cartEmpty.style.display = "none";
       console.log("cart on cart.html:", cart);

       let total = 0;
       let html = "";  // html table row is emty

       // each loop adds one more table row
       cart.forEach((item, index)=>{
        total += item.price * item.quantity;
        html += `
            <tr>
                <td>
                    ${item.id}<br>
                    color: ${item.color}<br>
                    size: ${item.size}
                </td>
                <td>${item.quantity}</td>
                <td>$${(item.price ? item.price.toFixed(2): "0.00")}</td>
                <td>
                    <button class = "remove-item" data-index = "${index}"> Remove </button> </td>
            </tr>
        `;
            
       })

       cartItems.innerHTML = html; 
       cartTotal.textContent = "$" + total.toFixed(2); 

       const removeButton = document.querySelectorAll(".remove-item"); 
       removeButton.forEach((button)=>{
        button.addEventListener("click", ()=>{
            const index = parseInt(button.dataset.index, 10); 

            const cart = JSON.parse(localStorage.getItem("cart")) || []; //current cart 
            cart.splice(index,1); 

            localStorage.setItem("cart", JSON.stringify(cart)); //save to localstorage 

            updateCartCount() //this  updates the number 
            window.location.reload(); //this reloads the page so we also see total update 
        })
       })

    }

    function updateCartCount (){
        const cart = JSON.parse(localStorage.getItem("cart"))|| []; 
        const cartCount = document.getElementById("cart-count");

        if (cartCount){
            cartCount.textContent = cart.length; 
        }
    }
    updateCartCount(); 

    async function loadProducts() {
        const container = document.getElementById("products-container"); 
        if(!container) return; 

        try{
            const response = await fetch("https://v2.api.noroff.dev/rainy-days");
            const data = await response.json();
            const products = data.data; 

            container.innerHTML = ""; 

            products.forEach(product =>{
                const card = document.createElement("div"); 
                card.classList.add("product-card")

                card.innerHTML = `
                    
                    <a href= "product-details/product-details.html?id=${product.id}">
                        <img src="${product.image.url}" alt= "${product.image.alt}"></img>
                        <h3>${product.title}</h3>
                        <p>$${product.discountedPrice ?? product.price}</p>
                    </a>
                `;

                container.appendChild(card); 
            });
        }catch (error){
            console.error("Error loading products:", error); 
            container.innerHTML = "<p>Failed to load products.</p>"
        };
        
    }

    loadProducts(); 
    updateCartCount();

async function loadSingleProduct() {
    const titleElement = document.getElementById("product-title"); 
    
    if(!titleElement) return; 

    const params = new URLSearchParams(window.location.search); 
    const productId = params.get("id"); 

    if (!productId){
        titleElement.textContent = "product not found"; 
        return;
    }

    try{ //fetch the product from the api 
        const response = await fetch ("https://v2.api.noroff.dev/rainy-days/" + productId);

        const data = await response.json(); 
        const product = data.data; 

        document.getElementById("product-image").src= product.image.url; 
        document.getElementById("product-image").alt = product.image.alt; 
        document.getElementById("product-title").textContent = product.title; 
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("product-price").textContent = "$" + (product.discountedPrice ?? product.price); 

        const addToCartBtn = document.querySelector(".add-to-cart"); 
        if(addToCartBtn){
            addToCartBtn.dataset.productId = product.id; 
            addToCartBtn.dataset.price = product.discountedPrice ?? product.price;
        }


    }catch(error){
        console.error("error loading product", error); 
        titleElement.textContent = "Failed to load product."; 
    }

}

    loadSingleProduct(); 
    updateCartCount()

});


