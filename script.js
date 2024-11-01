// Select DOM elements
const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const deliveryFeeDisplay = document.getElementById("delivery-fee");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const deliveryRegionSelect = document.getElementById("delivery-region");
const deliveryRegionWarn = document.getElementById("region-warn");
const paymentMethodSelect = document.getElementById("payment-method");
const paymentWarn = document.getElementById("payment-warn");
const changeRequestSection = document.getElementById("change-request");
const changeAmountInput = document.getElementById("change-amount");
const changeWarn = document.getElementById("change-warn");
const spanItem = document.getElementById("date-span");
const cartIcon = document.getElementById("cart-icon");
const addOnsModal = document.getElementById("add-ons-modal");
const closeAddOnsModalBtn = document.getElementById("close-add-ons-modal");
const flavorModal = document.getElementById("flavor-modal"); // Modal for flavor selection
const closeFlavorModalBtn = document.getElementById("close-flavor-modal"); // Close button for flavor modal

let cart = [];
let selectedAddOns = []; // Array to hold selected add-ons

// Delivery fees mapping
const deliveryFees = {
  DVO: 7.0,
  "Grande Vale": 7.0,
  "Novo Gama": 3.0,
  "Pedregal-Parada-5": 5.0,
  "Pedregal-Parada-10-15": 10.0,
  "Pedregal-Parada-6-9": 7.0,
  "Santa-Maria-101-104": 7.0,
  "Santa-Maria-201-204": 7.0,
  "Santa-Maria-301-304": 7.0,
  "Santa-Maria-401-404": 7.0,
  "Santa-Maria-105-110": 7.0,
  "Santa-Maria-205-210": 7.0,
  "Santa-Maria-305-310": 7.0,
  "Santa-Maria-405-410": 7.0,
};

// List of items that can have add-ons
const allowedItems = [
  "POTENZA",
  "MILANO",
  "NÁPOLES",
  "BAMBINO",
  "FLORENÇA",
  "ITALY CHEESE",
  "VENEZA",
  "RAVENA",
  "TRIO COLISEU - FILÉ DE FRANGO",
  "TRIO ITALY CHEESE",
  "TRIO POTENZA",
  "TRIO MILANO",
  "TRIO NÁPOLES",
  "TRIO FLORENÇA",
  "TRIO BAMBINO",
  "TRIO VENEZA",
  "TRIO RAVENA",
  "HAMBURGUER",
  "Cachorro quente",
  "CREME DE POLPA DE FRUTA: ESCOLHA O SABOR!",
  "SUCO DE POLPA DE FRUTA: ESCOLHA O SABOR!",
];

// Function to open the cart modal
function openCartModal() {
  updateCartModal();
  cartModal.style.display = "flex";
  document.body.style.overflow = "hidden"; // Disable background scroll
}

// Function to close the cart modal
function closeCartModal() {
  cartModal.style.display = "none";
  document.body.style.overflow = ""; // Re-enable background scroll
}

// Open cart modal
cartIcon.addEventListener("click", openCartModal);

// Close modal when clicking outside
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

// Close modal on button click
closeModalBtn.addEventListener("click", closeCartModal);

// Add item to cart
menu.addEventListener("click", (event) => {
  const parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    console.log(`Item added: ${name}`); // Log the item name

    // Check if the item is allowed to have add-ons
    if (allowedItems.includes(name)) {
      console.log(`Allowed item detected: ${name}`); // Log for allowed items
      // Open flavor modal for juices and creams
      if (name.includes("SUCO") || name.includes("CREME")) {
        console.log(`Opening flavor modal for: ${name}`); // Log for debugging
        flavorModal.classList.remove("hidden");
        flavorModal.dataset.itemName = name; // Store item name
        flavorModal.dataset.itemPrice = price; // Store item price
        document.body.style.overflow = "hidden"; // Disable background scroll
        return; // Exit to prevent opening add-ons modal
      } else {
        // Open add-ons modal for other items
        addOnsModal.classList.remove("hidden");
        addOnsModal.dataset.itemName = name; // Store item name
        addOnsModal.dataset.itemPrice = price; // Store item price
        selectedAddOns = []; // Reset selected add-ons
        document.body.style.overflow = "hidden"; // Disable background scroll
      }
    } else {
      console.log(`Item not allowed for add-ons: ${name}`); // Log for not allowed items
      // Add item to cart without add-ons
      addToCart(name, price);
    }
  }
});

// Close add-ons modal
closeAddOnsModalBtn.addEventListener("click", () => {
  addOnsModal.classList.add("hidden");
  document.body.style.overflow = ""; // Re-enable background scroll
});

// Close flavor modal
closeFlavorModalBtn.addEventListener("click", () => {
  flavorModal.classList.add("hidden");
  document.body.style.overflow = ""; // Re-enable background scroll
});

// Add flavor to cart
document.querySelectorAll(".flavor-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedFlavor = event.target.getAttribute("data-flavor");
    const itemName = flavorModal.dataset.itemName;
    const basePrice = parseFloat(flavorModal.dataset.itemPrice);

    // Log the selected flavor
    console.log(`Flavor button clicked: ${selectedFlavor}`); // Debug log

    // Check if selectedFlavor is not null
    if (!selectedFlavor) {
      console.error("Sabor selecionado é nulo.");
      return; // Exit if flavor is null
    }

    // Log selected flavor
    console.log(`Selected flavor: ${selectedFlavor}`);

    // Determine additional cost for Maracujá
    const additionalCost = selectedFlavor === "Maracujá" ? 2 : 0;

    const totalPrice = basePrice + additionalCost; // Calculate total price

    console.log(`Total price calculated: R$ ${totalPrice.toFixed(2)}`); // Debug log

    // Format item description correctly
    const description =
      `${itemName} - Sabor: ${selectedFlavor}` +
      (additionalCost > 0 ? ` (Adicional R$ ${additionalCost})` : "");

    // Add item to cart with selected flavor
    addToCart(description, totalPrice); // Add total price
    flavorModal.classList.add("hidden"); // Close the flavor modal
    document.body.style.overflow = ""; // Re-enable background scroll
  });
});

// Add add-ons to cart
document.querySelectorAll(".add-on-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedAddOn = event.target.getAttribute("data-name");
    const addOnPrice = parseFloat(event.target.getAttribute("data-price"));
    const itemName = addOnsModal.dataset.itemName;
    const itemPrice = parseFloat(addOnsModal.dataset.itemPrice);

    // Check if the add-on is already selected
    if (!selectedAddOns.includes(selectedAddOn)) {
      selectedAddOns.push(selectedAddOn); // Add to selected add-ons

      // Show Toastify notification
      Toastify({
        text: `${selectedAddOn} foi adicionado ao item!`,
        duration: 1500,
        close: true,
        gravity: "top",
        position: "left",
        stopOnFocus: true,
        style: { background: "#4caf50" },
      }).showToast();
    }

    // Update the item price to include the add-on price
    const totalPrice =
      itemPrice +
      selectedAddOns.reduce((total, addOn) => {
        const addOnButton = document.querySelector(
          `button[data-name="${addOn}"]`
        );
        return (
          total +
          (addOnButton ? parseFloat(addOnButton.getAttribute("data-price")) : 0)
        );
      }, 0);

    console.log(`Total price updated: R$ ${totalPrice.toFixed(2)}`); // Debug log
  });
});

// Confirm adding item with selected add-ons
document.getElementById("confirm-add-ons-btn").addEventListener("click", () => {
  const itemName = addOnsModal.dataset.itemName;
  const itemPrice = parseFloat(addOnsModal.dataset.itemPrice);

  // Calculate total price including add-ons
  const totalPrice =
    itemPrice +
    selectedAddOns.reduce((total, addOn) => {
      const addOnButton = document.querySelector(
        `button[data-name="${addOn}"]`
      );
      return (
        total +
        (addOnButton ? parseFloat(addOnButton.getAttribute("data-price")) : 0)
      );
    }, 0);

  // Add item to cart with all selected add-ons
  addToCart(itemName, totalPrice, selectedAddOns);
  addOnsModal.classList.add("hidden"); // Close the modal
  document.body.style.overflow = ""; // Re-enable background scroll
});

// Add to cart function
function addToCart(name, price, addOns = []) {
  // Create a unique identifier for the item based on its name and add-ons
  const uniqueIdentifier = `${name} - ${addOns.join(", ")}`;

  const existingItem = cart.find(
    (item) => item.uniqueIdentifier === uniqueIdentifier
  );
  if (existingItem) {
    existingItem.quantity += 1; // Increment quantity if item exists
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      addOns: [...addOns],
      uniqueIdentifier,
    }); // Add new item to cart
  }
  updateCartModal(); // Update cart display

  // Add 'added' class for animation
  const button = document.querySelector(`button[data-name="${name}"]`);
  if (button) {
    button.classList.add("added");
    setTimeout(() => button.classList.remove("added"), 200); // Remove class after animation
  }

  // Show Toastify notification
  Toastify({
    text: `${name} foi adicionado ao carrinho!`,
    duration: 1500,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: { background: "#4caf50" },
  }).showToast();
}

// Update cart modal
function updateCartModal() {
  let total = 0;
  let totalCount = 0;
  const cartItemsHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalCount += item.quantity;

      // Create a string for add-ons
      const addOnsDescription =
        item.addOns.length > 0 ? ` (${item.addOns.join(", ")})` : "";

      return `
      <div class="flex justify-between mb-4 flex-col">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">${item.name}${addOnsDescription}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${itemTotal.toFixed(2)}</p>
          </div>
          <div>
            <button class="decrement-item-btn" data-name="${
              item.name
            }" style="padding: 10px; font-size: 30px;">-</button>
            <button class="increment-item-btn" data-name="${
              item.name
            }" style="padding: 10px; font-size: 30px;">+</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  cartItemsContainer.innerHTML = cartItemsHTML; // Insert all at once

  const selectedRegion = deliveryRegionSelect.value;
  const deliveryFee = deliveryFees[selectedRegion] || 0;
  total += deliveryFee;

  cartTotal.textContent = `Valor total da compra: R$ ${total.toFixed(2)}`;
  deliveryFeeDisplay.textContent = `R$ ${deliveryFee.toFixed(2)}`;
  cartCounter.textContent = totalCount; // Update item count
}

// Update delivery fee when region changes
deliveryRegionSelect.addEventListener("change", () => {
  updateCartModal();
  validateRegion(); // Validate region on selection
});

// Show/hide change request section
paymentMethodSelect.addEventListener("change", () => {
  updateCartModal();
  validatePaymentMethod(); // Validate payment method on selection

  changeRequestSection.classList.toggle(
    "hidden",
    paymentMethodSelect.value !== "dinheiro"
  );
  if (paymentMethodSelect.value !== "dinheiro") {
    changeAmountInput.value = ""; // Clear input
    changeWarn.classList.add("hidden"); // Hide warning
  }
});

// Ensure change request section is hidden on page load
changeRequestSection.classList.add("hidden");

// Increment and decrement item quantity
cartItemsContainer.addEventListener("click", (event) => {
  const name = event.target.getAttribute("data-name");
  if (event.target.classList.contains("increment-item-btn")) {
    event.preventDefault();
    addToCart(name, 0);
  } else if (event.target.classList.contains("decrement-item-btn")) {
    event.preventDefault();
    removeFromCart(name);
  }
});

// Remove item from cart
function removeFromCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    item.quantity > 1 ? (item.quantity -= 1) : cart.splice(index, 1); // Decrement or remove item
    updateCartModal();
  }
}

// Validate address and show error message
function validateAddress() {
  const isValid = addressInput.value.trim() !== "";
  addressWarn.classList.toggle("hidden", isValid);
  addressInput.classList.toggle("border-red-500", !isValid);
  return isValid;
}

// Add listener for address input
addressInput.addEventListener("input", validateAddress);

// Validate delivery region and show/remove error message
function validateRegion() {
  const isValid = deliveryRegionSelect.value !== "";
  deliveryRegionWarn.classList.toggle("hidden", isValid);
  deliveryRegionSelect.classList.toggle("border-red-500", !isValid);
  return isValid;
}

// Validate payment method and show error message
function validatePaymentMethod() {
  const isValid = paymentMethodSelect.value !== "";
  paymentWarn.classList.toggle("hidden", isValid);
  paymentMethodSelect.classList.toggle("border-red-500", !isValid);
  return isValid;
}

// Validate change amount if payment method is "Dinheiro"
function validateChangeAmount() {
  if (paymentMethodSelect.value === "dinheiro") {
    const changeAmount = changeAmountInput.value;
    const isValid = changeAmount.trim() !== "" && parseFloat(changeAmount) > 0;
    changeWarn.classList.toggle("hidden", isValid);
    changeAmountInput.classList.toggle("border-red-500", !isValid);
    return isValid;
  }
  return true; // No validation needed if not "Dinheiro"
}

// Finalize order
checkoutBtn.addEventListener("click", () => {
  if (!checkRestauranteOpen()) {
    Toastify({
      text: "Ops, o restaurante está fechado!",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: { background: "#ef4444" },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  // Validate all fields in the desired order
  if (!validateRegion() || !validatePaymentMethod() || !validateAddress()) {
    return; // If any validation fails, do not proceed
  }

  // Prepare message for WhatsApp
  const message = prepareWhatsAppMessage();
  const encodedMessage = encodeURIComponent(message);
  const phone = "61991861446";

  // Show thank you modal
  const thankYouModal = document.getElementById("thank-you-modal");
  thankYouModal.classList.remove("hidden");

  // Add countdown
  let countdown = 4; // 4 seconds
  const countdownDisplay = document.getElementById("countdown");
  countdownDisplay.textContent = `Redirecionando em ${countdown} segundos...`;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = `Redirecionando em ${countdown} segundos...`;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      const url = `whatsapp://send?phone=${phone}&text=${encodedMessage}`; // Alterado para whatsapp://
      window.location.href = url; // Tentar abrir diretamente no aplicativo
      thankYouModal.classList.add("hidden");
    }
  }, 1000); // Update every second

  // Reset cart and fields
  resetCartAndFields();
});

// Prepare WhatsApp message
function prepareWhatsAppMessage() {
  const observation = document.getElementById("observation").value;
  const cartItems = cart
    .map(
      (item) =>
        `- ${item.name}${
          item.addOns.length > 0
            ? ` (Adicionais: ${item.addOns.join(", ")})`
            : ""
        }\n  Quantidade: ${item.quantity}\n  Preço: R$ ${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedRegion = deliveryRegionSelect.value;
  const deliveryFee = deliveryFees[selectedRegion] || 0;
  const paymentMethod = paymentMethodSelect.value; // Get the selected payment method

  return `Pedido:\n\n${cartItems}\n\nObservações: ${observation}\n\nEndereço: ${
    addressInput.value
  }\n\nMétodo de pagamento: ${paymentMethod}\n\nTaxa de entrega: R$ ${deliveryFee.toFixed(
    2
  )}\nValor total: R$ ${(total + deliveryFee).toFixed(2)}`;
}

// Reset cart and input fields
function resetCartAndFields() {
  cart = [];
  addressInput.value = "";
  deliveryRegionSelect.value = "";
  paymentMethodSelect.value = "";
  changeAmountInput.value = "";
  document.getElementById("observation").value = ""; // Clear observation field
  updateCartModal(); // Update cart modal
  cartModal.style.display = "none"; // Close cart modal
  document.body.style.overflow = ""; // Re-enable background scroll
}

// Check if the restaurant is open
function checkRestauranteOpen() {
  const date = new Date();
  const hour = date.getHours();
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return dayOfWeek >= 1 && dayOfWeek <= 7 && hour >= 1 && hour < 24; // Both conditions must be true
}

// Update spanItem color based on restaurant status
const isOpen = checkRestauranteOpen();
spanItem.classList.toggle("bg-green-600", isOpen);
spanItem.classList.toggle("bg-red-500", !isOpen);

// Add listeners to hide error messages on option selection
deliveryRegionSelect.addEventListener("change", validateRegion);
paymentMethodSelect.addEventListener("change", validatePaymentMethod);

// Prevent context menu
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Prevent double-tap zoom
document.addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault(); // Prevent zooming on multi-touch
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 200) {
      event.preventDefault(); // Prevent double-tap zoom
    }
    lastTouchEnd = now;
  },
  { passive: false }
);

// Apply touch-action to all buttons
document.querySelectorAll("button").forEach((button) => {
  button.style.touchAction = "manipulation"; // Prevents double-tap zoom
});
// Seleciona todas as imagens e textos que você deseja embaçar e ocultar
const images = document.querySelectorAll("img");

// Aplica a classe 'blur' a todas as imagens
images.forEach((img) => {
  img.classList.add("blur");
});

// Aplica a classe 'hidden' a todos os textos
texts.forEach((text) => {
  text.classList.add("hidden");
});

// Se você quiser aplicar a classe 'hidden' apenas a textos específicos,
// você pode adicionar condições aqui, por exemplo, com base em atributos ou classes.
