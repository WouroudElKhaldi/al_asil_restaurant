const phone = "96171400452";
const placeholder = "placeholder.png";
const deliveryFee = 100000;

const menuData = [
    {
        cat: "صحن مع سرفيس خضار وخبز عربي", items: [
            ["فلافل", 100000, "falafel.png"], ["حمص", 250000, "hommos.png"], ["مسبحة", 250000, "msabaha.png"], ["فول حامض", 250000, "foul_hamed.png"],
            ["فول خضار", 250000, "foul_khoudar.png"], ["فول طحينة", 250000, "foul_tahina.png"], ["ماليزية", 300000, "malizye.png"],
            ["فتة", 300000, "fatteh.png"], ["فتة بلحم", 400000, "fatteh_lahem.png"], ["حمص بلحم", 400000, "hommos_lahem.png"], ["بيض مقلي", 200000, "bed_me2li.png"]
        ]
    },
    { cat: "علب نصف كيلو", items: [["حمص", 200000, ""], ["فول", 200000, ""], ["مسبحة", 200000, ""]] },
    {
        cat: "معجنات", items: [
            ["جبنة", 100000, ""], ["جبنة اكسترا", 150000, ""], ["جبنة خضار", 150000, ""],
            ["لحمة", 100000, ""], ["لحمة اكسترا", 150000, ""], ["قريش", 100000, ""],
            ["سبانغ", 100000, ""], ["زعتر", 50000, ""], ["زعتر خضار", 80000, ""],
            ["نص زعتر جبنة", 100000, ""], ["كعك جبن", 100000, ""], ["كعك خضار", 150000, ""],
            ["بيتزا صغير", 350000, ""], ["بيتزا وسط", 500000, ""], ["بيتزا كبير", 850000, ""],
            ["بعلبكية", 400000, ""], ["سواري مشكل", 350000, ""], ["شامية", 600000, ""]
        ]
    },
    {
        cat: "عصائر", items: [
            ["بيبسي 2 لتر", 150000, "pepsi_2_liter.png"], ["بيبسي لتر وربع", 130000, "pepsi_1_4_liter.png"], ["بيبسي تنك", 70000, "pepsi_tanak.png"],
            ["بيبسي زجاج", 30000, "pepsi_2zez.png"], ["عيران", 50000, "3iran.png"], ["مياه كبير", 40000, "may_kbire.png"], ["مياه صغير", 20000, "may_z8ire.png"]
        ]
    }
];

const menu = document.getElementById("menu");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const categoryButtons = document.getElementById("categoryButtons");

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let currentCategory = "الكل";

/* CATEGORIES */
["الكل", ...menuData.map(c => c.cat)].forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === "الكل") btn.classList.add("active");
    btn.onclick = () => {
        currentCategory = cat;
        document.querySelectorAll("#categoryButtons button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu();
    };
    categoryButtons.appendChild(btn);
});

/* MENU */
function renderMenu() {
    menu.innerHTML = "";

    menuData.forEach(c => {
        if (currentCategory !== "الكل" && c.cat !== currentCategory) return;

        menu.innerHTML += `<div class="category">${c.cat}</div>`;

        c.items.forEach(i => {
            const imgSrc = i[2] && i[2].trim() !== "" ? i[2] : placeholder;

            menu.innerHTML += `
            <div class="item">
                <img src="${imgSrc}" alt="${i[0]}">
                <div class="item-info">
                    <strong>${i[0]}</strong>
                    <div class="price">${i[1]} ل.ل</div>
                </div>
                <button 
                    class="btn-add ${cart[i[0]] ? 'disabled' : ''}" 
                    ${cart[i[0]] ? 'disabled' : ''}
                    data-name="${i[0]}"
                    onclick="addToCart('${i[0]}',${i[1]}, this)">
                    +
                </button>
            </div>`;
        });
    });
}

renderMenu();

/* CART */
function addToCart(name, price, btn) {
    if (cart[name]) return;

    cart[name] = { price, qty: 1 };
    saveCart();
    renderCart();
    showToast();

    if (btn) {
        btn.classList.add("disabled");
        btn.disabled = true;
    }
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function changeQty(name, d) {
    if (!cart[name]) return;

    cart[name].qty += d;

    if (cart[name].qty <= 0) {
        delete cart[name];

        // 🔓 Reactivate Add button in menu
        const btn = document.querySelector(`.btn-add[data-name="${name}"]`);
        if (btn) {
            btn.disabled = false;
            btn.classList.remove("disabled");
        }
    }

    saveCart();
    renderCart();
}


function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    Object.keys(cart).forEach(n => {
        total += cart[n].price * cart[n].qty;
        cartItems.innerHTML += `
      <div class="cart-item">
        <span>${n}</span>
        <div class="qty">
          <button onclick="changeQty('${n}',1)">+</button>
          <span>${cart[n].qty}</span>
          <button onclick="changeQty('${n}',-1)">−</button>
        </div>
      </div>`;
    });

    cartItems.innerHTML += `
    <div class="cart-item">
      <strong>توصيل</strong>
      <strong>${deliveryFee} ل.ل</strong>
    </div>`;

    totalEl.textContent = total + deliveryFee;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

renderCart();

/* WHATSAPP */
function sendWhatsApp() {
    let msg = "طلب من مطعم الأسيل:%0A%0A";
    let total = 0;

    Object.keys(cart).forEach(name => {
        const item = cart[name];
        const lineTotal = item.price * item.qty;
        total += lineTotal;

        msg += `- ${name} × ${item.qty} = ${lineTotal.toLocaleString()} ل.ل%0A`;
    });

    msg += `%0A- توصيل × 1 = 100,000 ل.ل%0A`;
    total += 100000;

    msg += `%0Aالمجموع: ${total.toLocaleString()} ل.ل`;

    cart = {};
    localStorage.removeItem("cart");
    renderCart();

    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}

/* CART TOGGLE */
document.getElementById("cartToggle").onclick = () =>
    document.querySelector(".cart-panel").classList.add("open");

document.getElementById("closeCart").onclick = () =>
    document.querySelector(".cart-panel").classList.remove("open");

/* THEME LOAD */
const savedTheme = localStorage.getItem("theme");

document.body.classList.remove("light", "dark");

if (savedTheme) {
    document.body.classList.add(savedTheme);
} else {
    document.body.classList.add("light"); // default
}

updateThemeButton();

function toggleTheme() {
    const body = document.body;

    if (body.classList.contains("light")) {
        body.classList.remove("light");
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark");
        body.classList.add("light");
        localStorage.setItem("theme", "light");
    }

    updateThemeButton();
}


function updateThemeButton() {
    const btn = document.querySelector(".toggle-theme");
    if (!btn) return;

    btn.textContent =
        document.body.classList.contains("dark")
            ? "الوضع النهاري"
            : "الوضع الليلي";
}
