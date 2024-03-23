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
cartBtn.addEventListener("click", function(){   
    updateCartModal();   // atualiza o carrinho
    cartModal.style.display = "flex"    // quando clicar no botão do carrinho o modal mudará para display flex 
})

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){    // se o target(onde clicou) for apenas o cartModal o modal mudará para display none
        cartModal.style.display = "none"
    }
})

// fechar modal quando clicar em fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"    // se o target(onde clicou) for no botão fechar o modal mudará para display none
})

// adicionar ao carrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")    // declara o elemento, vai limitar ao próprio elemento e seu parente (se clicar no botão de adicionar ao carrinho (pai) ou no icone (filho))

    if(parentButton){
        const name = parentButton.getAttribute("data-name")    // pega o atributo indicado
        const price =  parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)      // chama a função para adicionar o item ao carrinho
    }
})

// função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)    // percorre o array e verifica se o item existe

    if(existingItem){   // se o item já existe aumenta a qtd + 1
        existingItem.quantity += 1;
        return;
    }
    else {
        cart.push({     // adciona as propriedades no array(lista)
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()   // chama a função de atualizar o carrinho*/
}

// atualizar o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";  // vai acessar os itens do modal no html, vai começar vazio
    let total = 0;  // total começará em 0

    cart.forEach(item => {  // lopping, vai percorrer cada item da lista
        const cartItemElement = document.createElement("div");    // cria um elemento html via javascript

        cartItemElement.classList.add("item-descrition")

        cartItemElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <p style= "margin-bottom: 12px;">${item.name}</p>
                    <p style= "font-weight: normal; margin-bottom: 12px;">Qtd: ${item.quantity}</p>
                    <p style= "font-weight: normal;">${item.price.toFixed(2)}</p>
                </div>

                <div>
                    <button class= "remove-from-card-btn" data-name="${item.name}">
                    Remover
                    </button>
                </div>
            </div>
        `

        total += item.price * item.quantity;    // calcular total

        cartItemsContainer.appendChild(cartItemElement)     // adiciona o elemento(cartItemElement) dentro do cartItemsContainer

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });  // adiciona o total já com o padrão R$

    cartCounter.innerHTML = cart.length;    // contador dos itens do carrinho
}

// função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-card-btn")){      // verfica se no botão tem a classe remove-from-card-btn
        const name = event.target.getAttribute("data-name")      // pega o atributo data-name

        removeItemCard(name);   // chama a função de remover item do carrinho 
    }   
})

function removeItemCard(name){
    const index = cart.findIndex(item => item.name === name);     // procura o index do item na lista

    if(index !== -1){    // se encontrar o item
        const item = cart[index];   // acessa o item que clicou

        if(item.quantity > 1){      // se a quantidade for maior que 1 diminui a quantidade
            item.quantity -= 1;
            updateCartModal();
            return;
        }

            cart.splice(index, 1);   // se houver apenas 1 remove o item completo da lista
            updateCartModal();

    }
}

// pega o que foi digitado no input do modal
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressWarn.style.display = "none"     // sumirá com a mensagem para digitar o endereço
        addressInput.style.border = "none"      // sumirá com a borda vermelha
    }
})

// finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops! No momento o restaurante não está aberto. \nHorário de funcionamento: Seg á Dom - 17:00 ás 23:00",
            duration: 5000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
              'text-align': 'center' // Aplicando o alinhamento central ao texto
            },
          }).showToast();
          return;
    }

    if(cart.length === 0) return;     // se não houver nenhum item no carrinho não será possivel finalizar pedido

    if(addressInput.value === ""){  // se não houver nada escrito no input do endereço
        addressWarn.style.display = "block"     // aparecerá uma mensagem para digitar o endereço
        addressInput.style.border = "1px solid red"     // aplicará uma borda vermelha
        return;
    }

    // enviar pedido para a api do whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name}\nQuantidade: (${item.quantity})\nPreço: R$: (${item.price})\n\n`  // mensagem em forma de array
        )
    }).join("")     // junta todo o array

    const message = encodeURIComponent(cartItems)
    const phone = "21999999999"

    window.open(`https://wa.me/${phone}?text=${message}%0ATotal:%20${cartTotal.textContent}%0AEndereço:%20${addressInput.value}`, "_blank")
})


// verificar a hora e manipular o card de horário de funcionamento
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 23;     // reastaurante aberto
}

const spanItem = document.getElementById("date")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("isclosed")
    spanItem.classList.add("isopen")
}
else{
    spanItem.classList.remove("isopen")
    spanItem.classList.add("isclosed")
}

