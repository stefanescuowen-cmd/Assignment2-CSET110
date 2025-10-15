// Wait until the page has fully loaded
if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready);
} else{
    ready()
}


// Main setup function
function ready(){
    // Attach remove button events
    let removeCartButtons = document.getElementsByClassName('btn-danger');
    for (let button of removeCartButtons){
        button.addEventListener('click', removeCartItem)
    }

    // Attach quantity input events
    let quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (let input of quantityInputs){
        input.addEventListener('change', quantityChanged)
        input.setAttribute('min', '1');
    }

    // Attach add-to-cart events
    let addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (let button of addToCartButtons){
        button.addEventListener('click', addToCartClicked)
    }

    // Attach purchase button event
    document
        .getElementsByClassName('btn-purchase')[0]
        .addEventListener('click', purchaseClicked)

    updateCartTotal();
}


// Called when add to cart button is clicked.
function addToCartClicked(event){
    const button = event.target;
    
    // Find the parent shop-item
    const shopItem = button.closest('.shop-item');
    const title = shopItem.querySelector('.shop-item-title').innerText;
    const price = shopItem.querySelector('.shop-item-price').innerText;
    const imageSrc = shopItem.querySelector('.shop-item-image').src;

    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}


// Add a new cart row
function addItemToCart(title, price, imageSrc){
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    // Check for duplicate
    for (let i = 0; i < cartItemNames.length; i++){
        if (cartItemNames[i].innerText === title){
            alert('This item has already been added to the cart.');
            return;
        }
    }

    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.innerHTML = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1" min="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
    `;
    cartItems.appendChild(cartRow);

    // Attach listeners to the new row's remove button and quantity input
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
    const newInput = cartRow.querySelector('.cart-quantity-input');
    newInput.addEventListener('change', quantityChanged);
    newInput.setAttribute('min', '1')
}


// When remove is clicked
function removeCartItem(event){
    const buttonClicked = event.target;
    buttonClicked.closest('.cart-row').remove();
    updateCartTotal();
}


// When quantity is changed
function quantityChanged(event){
    const input = event.target;
    // Guard against invalid values
    if(isNaN(input.value) || input.value <= 0 || !Number.isInteger(parseFloat(input.value))){
        input.value = 1;
    }
    updateCartTotal();
}


// Recalculate total
function updateCartTotal(){
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartTotalElement = document.getElementsByClassName('cart-total-price')[0];
    if (!cartItemContainer || !cartTotalElement) return;
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;
    for(let i = 0; i < cartRows.length; i++){
        const row = cartRows[i];
        const priceElement = row.querySelector('.cart-price');
        const quantityElement = row.querySelector('.cart-quantity-input');
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = parseInt(quantityElement.value);
        total += price * quantity;
    }
    // Round to two decimals
    total = Math.round(total * 100) / 100;
    cartTotalElement.innerText = '$' + total.toFixed(2);
}


// When purchase button is clicked
function purchaseClicked(){
    alert('Thank you for your purchase!')
    const cartItems = document.getElementsByClassName('cart-items')[0];

    // Remove all child nodes
    while (cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}