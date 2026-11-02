

const bakeryProducts = [
    {
        id: 4,
        name: "Tiramisu Cake",
        price: 39000
    },
    {
        id: 5,
        name: "Matcha Cheesecake",
        price: 35000
    },
    {
        id: 6,
        name: "Passion Fruit Cheesecake",
        price: 35000
    },
    {
        id: 7,
        name: "Cacao Mousse",
        price: 35000
    },
    {
        id: 8,
        name: "Butter Croissant",
        price: 29000
    },
    {
        id: 9,
        name: "Caramel Cheesecake",
        price: 35000
    }
];

let bakeryCart = JSON.parse(
    localStorage.getItem("pinkBakeryCart") || "[]"
);

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + "đ";
}

function saveCart() {
    localStorage.setItem(
        "pinkBakeryCart",
        JSON.stringify(bakeryCart)
    );
}

function addCart(productName) {
    const product = bakeryProducts.find(
        p => p.name === productName
    );

    if (!product) return;

    const item = bakeryCart.find(p => p.id === product.id);

    if (item) {
        item.quantity++;
    } else {
        bakeryCart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    alert("Đã thêm " + product.name + " vào giỏ hàng!");
}

function changeQuantity(id, amount) {
    const item = bakeryCart.find(p => p.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        bakeryCart = bakeryCart.filter(p => p.id !== id);
    }

    saveCart();
    renderCart();
}

function removeCartItem(id) {
    bakeryCart = bakeryCart.filter(p => p.id !== id);
    saveCart();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("bakery-cart");
    if (!container) return;

    let total = 0;
    let count = 0;

    const rows = bakeryCart.map(item => {
        const product = bakeryProducts.find(p => p.id === item.id);
        if (!product) return "";

        total += product.price * item.quantity;
        count += item.quantity;

        return `
            <div class="cart-row">
                <strong>${product.name}</strong>
                <span>${formatMoney(product.price)}</span>
                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeCartItem(${item.id})">Xóa</button>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <h2>🛒 GIỎ HÀNG CỦA BẠN (${count})</h2>
        ${rows || "<p>Giỏ hàng đang trống.</p>"}
        <h3>Tổng tiền: ${formatMoney(total)}</h3>
        <button class="bakery-btn" onclick="checkoutBakery()">
            Đặt hàng
        </button>
    `;
}


// MỞ FORM ĐẶT HÀNG
function checkoutBakery() {
    if (bakeryCart.length === 0) {
        alert("Vui lòng chọn bánh trước khi đặt hàng!");
        return;
    }

    const form = document.getElementById("checkout-form");
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
}

// XÁC NHẬN ĐẶT HÀNG
function submitBakeryOrder(event) {
    event.preventDefault();

    if (bakeryCart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const note = document.getElementById("orderNote").value.trim();

    if (!name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const total = bakeryCart.reduce((sum, item) => {
        const product = bakeryProducts.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    alert(
        "🎉 ĐẶT HÀNG THÀNH CÔNG (DEMO)!\n\n" +
        "Khách hàng: " + name + "\n" +
        "Số điện thoại: " + phone + "\n" +
        "Địa chỉ: " + address + "\n" +
        "Ghi chú: " + (note || "Không có") + "\n" +
        "Tổng tiền: " + formatMoney(total) + "\n\n" +
        "Pink Bakery cảm ơn bạn! 💗"
    );

    bakeryCart = [];
    saveCart();
    renderCart();

    document.getElementById("orderForm").reset();
    document.getElementById("checkout-form").style.display = "none";
}


document.addEventListener("DOMContentLoaded", renderCart);

// TÌM KIẾM VÀ LỌC SẢN PHẨM

function filterCakes() {
    const keyword = document
        .getElementById("searchCake")
        .value.toLowerCase().trim();

    const category = document
        .getElementById("categoryCake")
        .value;

    const cards = document.querySelectorAll(".bakery-card");

    cards.forEach(card => {
        const name = card.getAttribute("data-name") || "";
        const type = card.getAttribute("data-category") || "";

        const matchName = name.includes(keyword);
        const matchCategory =
            category === "all" || type === category;

        card.style.display =
            matchName && matchCategory ? "" : "none";
    });

    // PINK BAKERY - ĐĂNG NHẬP / ĐĂNG KÝ DEMO
    // Chỉ phục vụ học tập, không dùng tài khoản thật.

    const DEMO_USERS_KEY = "pinkBakeryDemoUsers";
    const DEMO_SESSION_KEY = "pinkBakeryDemoSession";

    // Chuyển đổi giữa hai form
    function showAccountTab(tab) {
        document.getElementById("loginForm").style.display =
            tab === "login" ? "block" : "none";

        document.getElementById("registerForm").style.display =
            tab === "register" ? "block" : "none";
    }

    // Tạo tài khoản demo
    function registerBakery(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("registerPassword").value;

        if (!name || !email || password.length < 6) {
            alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
            return;
        }

        // Chỉ lưu email và tên, không lưu mật khẩu.
        const users = JSON.parse(
            localStorage.getItem(DEMO_USERS_KEY) || "[]"
        );

        if (users.some(user => user.email === email)) {
            alert("Email này đã đăng ký!");
            return;
        }

        users.push({ name, email });

        localStorage.setItem(
            DEMO_USERS_KEY,
            JSON.stringify(users)
        );

        // Phiên demo: mật khẩu chỉ được kiểm tra độ dài.
        // Không có cơ chế xác thực mật khẩu thật.
        sessionStorage.setItem(
            DEMO_SESSION_KEY,
            JSON.stringify({ name, email })
        );

        document.getElementById("registerForm").reset();
        updateAccountUI();

        alert("Đăng ký tài khoản demo thành công!");
    }

    // Đăng nhập demo bằng email đã đăng ký
    function loginBakery(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(
            localStorage.getItem(DEMO_USERS_KEY) || "[]"
        );

        const user = users.find(u => u.email === email);

        if (!user || !password) {
            alert("Không tìm thấy tài khoản hoặc thiếu thông tin!");
            return;
        }

        // DEMO: không xác minh mật khẩu.
        sessionStorage.setItem(
            DEMO_SESSION_KEY,
            JSON.stringify(user)
        );

        document.getElementById("loginForm").reset();
        updateAccountUI();

        alert("Đăng nhập demo thành công!");
    }

    // Cập nhật giao diện khi đăng nhập
    function updateAccountUI() {
        const session = JSON.parse(
            sessionStorage.getItem(DEMO_SESSION_KEY) || "null"
        );

        const forms = document.getElementById("accountForms");
        const welcome = document.getElementById("accountWelcome");
        const welcomeUser = document.getElementById("welcomeUser");

        if (!forms || !welcome || !welcomeUser) return;

        if (session) {
            forms.style.display = "none";
            welcome.style.display = "block";

            welcomeUser.textContent =
                "Xin chào, " + session.name + "! 💗";
        } else {
            forms.style.display = "block";
            welcome.style.display = "none";
            showAccountTab("login");
        }
    }

    // Đăng xuất
    function logoutBakery() {
        sessionStorage.removeItem(DEMO_SESSION_KEY);
        updateAccountUI();
        alert("Đã đăng xuất!");
    }

    document.addEventListener("DOMContentLoaded", updateAccountUI);

}

