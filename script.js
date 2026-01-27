const phone = "96171400452"; // WhatsApp number
const placeholder = "placeholder.png"; // Placeholder image

const menuData = [
    {
        cat: "صحن مع سرفيس خضار وخبز عربي", items: [
            ["فلافل", 100000], ["حمص", 250000], ["مسبحة", 250000], ["فول حامض", 250000], ["فول خضار", 250000],
            ["فول طحينة", 250000], ["ماليزية", 300000], ["فتة", 300000], ["فتة بلحم", 400000],
            ["حمص بلحم", 400000], ["بيض مقلي", 200000]
        ]
    },
    {
        cat: "علب نصف كيلو", items: [
            ["حمص", 200000], ["فول", 200000], ["مسبحة", 200000]
        ]
    },
    {
        cat: "معجنات", items: [
            ["جبنة", 100000], ["جبنة اكسترا", 150000], ["جبنة خضار", 150000], ["لحمة", 100000],
            ["لحمة اكسترا", 150000], ["قريش", 100000], ["سبانغ", 100000], ["زعتر", 50000],
            ["زعتر خضار", 80000], ["نص زعتر جبنة", 100000], ["كعك جبن", 100000], ["كعك خضار", 150000],
            ["بيتزا صغير", 350000], ["بيتزا وسط", 500000], ["بيتزا كبير", 850000],
            ["بعلبكية", 400000], ["سواري مشكل", 350000], ["شامية", 600000]
        ]
    },
    {
        cat: "عصائر", items: [
            ["بيبسي 2 لتر", 150000], ["بيبسي لتر وربع", 130000], ["بيبسي تنك", 70000],
            ["بيبسي زجاج", 30000], ["عيران", 50000], ["مياه كبير", 40000], ["مياه صغير", 20000]
        ]
    }
];

const menuDiv = document.getElementById("menu");
const cartItemsDiv = document.getElementById("cartItems");
const totalDiv = document.getElementById("total");
const categoryButtonsDiv = document.getElementById("categoryButtons");

let cart = {};
let currentCategory = "الكل";
const deliveryFee = 100000;

// Load cart from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    renderMenu();
    renderCart();

    // Initialize theme button text
    const btn = document.querySelector(".toggle-theme");
    btn.innerText = document.body.classList.contains("light") ? "الوضع الليلي" : "الوضع النهاري";
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Generate category buttons
let allCategories = ["الكل", ...menuData.map(c => c.cat)];
allCategories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    if (cat === "الكل") btn.classList.add("active");
    btn.onclick = () => {
        currentCategory = cat;
        document.querySelectorAll("#categoryButtons button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu();
    };
    categoryButtonsDiv.appendChild(btn);
});

// Render menu items
function renderMenu() {
    menuDiv.innerHTML = "";
    menuData.forEach(c => {
        if (currentCategory !== "الكل" && c.cat !== currentCategory) return;
        menuDiv.innerHTML += `<div class="category">${c.cat}</div>`;
        c.items.forEach(i => {
            menuDiv.innerHTML += `
        <div class="item">
          <img src="${placeholder}" alt="${i[0]}">
          <div class="item-info">
            <strong>${i[0]}</strong>
            <span class="price">${i[1]} ل.ل</span>
          </div>
          <button class="btn btn-add" onclick="addToCart('${i[0]}',${i[1]})">+</button>
        </div>`;
        });
    });
}

// CART FUNCTIONS
function addToCart(name, price) {
    if (!cart[name]) {
        cart[name] = { price, qty: 1 };
    } else {
        cart[name].qty++;
    }
    saveCart();
    renderCart();
}

function changeQty(name, delta) {
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    saveCart();
    renderCart();
}

function renderCart() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    Object.keys(cart).forEach(name => {
        const item = cart[name];
        total += item.price * item.qty;
        cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <span>${name}</span>
        <span>${item.price} ل.ل</span>
        <div class="qty">
          <button onclick="changeQty('${name}',1)">+</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${name}',-1)">−</button>
        </div>
      </div>`;
    });

    // Add delivery fee row
    cartItemsDiv.innerHTML += `
    <div class="cart-item">
      <span>توصيل</span>
      <span>${deliveryFee} ل.ل</span>
    </div>
  `;
    total += deliveryFee;
    totalDiv.innerText = total;
}

// WhatsApp order
function sendWhatsApp() {
    if (Object.keys(cart).length === 0) return; // nothing to send

    let msg = "طلب من مطعم الأصيل:%0A";
    Object.keys(cart).forEach(n => {
        msg += `- ${n} × ${cart[n].qty}%0A`;
    });
    msg += `- توصيل × 1%0A`; // delivery line
    msg += `%0Aالمجموع: ${totalDiv.innerText} ل.ل`;

    // Clear cart after ordering
    cart = {};
    localStorage.removeItem("cart");
    renderCart();

    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}

// Theme toggle
function toggleTheme() {
    if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        document.querySelector(".toggle-theme").innerText = "الوضع النهاري"; // Light mode
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        document.querySelector(".toggle-theme").innerText = "الوضع الليلي"; // Night mode
    }
}
