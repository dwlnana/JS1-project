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

            window.location.href = "../cart.html"; // this will take us to cart.html page 
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
                <td>$${item.price.toFixed(2)}</td>
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
        })
       })

    }

});

