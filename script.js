const menu = document.getElementById("menu")    // pega o elemento com o id indicado
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

// array(lista) do carrinho
let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function(){   // quando clicar no elemento aplica uma função
    cartModal.style.display = "flex"            // aplica para display flex
})

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){             // aplica se o target(onde clicou) for apenas o cartModal
        cartModal.style.display = "none"
    }
})

// fechar modal quando clicar em fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// adicionar ao carrinho
menu,addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-cart-btn")    // declara o elemento, vai limitar ao próprio elemento e seu parente

    if(parentButton){
        const name = parentButton.getAttribute("data-name")     // pega o atributo indicado
        const price = parentButton.getAttribute("data-price")

        addToCart(name, price)      // chama a função
    }
})

// função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name )    // percorre o array e verifica se o item existe

    if(existingItem){   // se o item já existe aumenta a qtd + 1
        existingItem.quantity += 1;
        return;
    }

    cart.push({     // adciona essas propriedades na lista
        name,
        price,
        quantity: 1,
    })
}