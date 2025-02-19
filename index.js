document.addEventListener("DOMContentLoaded", function () {
    const authModal = document.getElementById("authModal");
    const closeModal = document.querySelector(".closeModal");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const switchToSignup = document.getElementById("switchToSignup");
    const switchToLogin = document.getElementById("switchToLogin");
    const authTitle = document.getElementById("authTitle");
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");
    const logoutButton = document.getElementById("logoutButton");
    const userDisplay = document.getElementById("userDisplay");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");

    // ✅ Email & Password Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const BASE_URL = "https://69e8-146-196-32-48.ngrok-free.app/api"; // Update this once backend is live
    // const BASE_URL = "http://localhost:3001/api"; // Update this once backend is live

    // ✅ Utility Functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    function checkUserSession() {
        const isUserAuth = getCookie("isUserAuth");
        const username = getCookie("username");
        if (isUserAuth) {
            loginButton.style.display = "none";
            signupButton.style.display = "none";
            userNameDisplay.innerText = `${username}`;
            userDisplay.style.display = "flex";
            logoutButton.style.display = "none"; // Hide logout initially
        } else {
            loginButton.style.display = "inline";
            signupButton.style.display = "inline";
            userDisplay.style.display = "none";
            logoutButton.style.display = "none";
        }
    }

    checkUserSession(); // Check user session on page load

    // ✅ Toggle Signup Form
    switchToSignup.addEventListener("click", () => {
        loginForm.style.display = "none";
        signupForm.style.display = "flex";
        authTitle.innerText = "Sign Up";
    });

    // ✅ Toggle Login Form
    switchToLogin.addEventListener("click", () => {
        signupForm.style.display = "none";
        loginForm.style.display = "flex";
        authTitle.innerText = "Login";
    });

    loginButton.addEventListener("click", () => {
        signupForm.style.display = "none";
        loginForm.style.display = "flex";
        authTitle.innerText = "Login";
    });

    signupButton.addEventListener("click", () => {
        loginForm.style.display = "none";
        signupForm.style.display = "flex";
        authTitle.innerText = "Sign Up";
    });

    // ✅ Show Modal on Login or Signup Click
    [loginButton, signupButton].forEach((btn) => {
        btn.addEventListener("click", () => {
            authModal.style.display = "flex";
        });
    });

    // ✅ Show Login Modal If User Is Not Authenticated (Search Click)
    [searchInput, searchBtn].forEach((element) => {
        element.addEventListener("click", () => {
            if (!getCookie("isUserAuth")) {
                loginForm.style.display = "flex";
                signupForm.style.display = "none";
                authTitle.innerText = "Login";
                authModal.style.display = "flex";
            }
        });
    });

    // ✅ Close Modal
    closeModal.addEventListener("click", () => {
        authModal.style.display = "none";
    });

    // ✅ Toggle Logout Button When Clicking on Username
    userDisplay.addEventListener("click", () => {
        logoutButton.style.display = logoutButton.style.display === "inline" ? "none" : "inline";
    });

    // ✅ Login API
    async function loginUser(email, password) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Login request failed" };
        }
    }

    // ✅ Signup API
    async function signupUser(email, username, password) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/signup`, { email, username, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Signup request failed" };
        }
    }

    // ✅ Handle Login
    document.getElementById("loginSubmit").addEventListener("click", async function () {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await loginUser(email, password);
            alert("Login successful!");
            setCookie("isUserAuth", true, 10);
            setCookie('username', response.user.username, 10);
            authModal.style.display = "none"; // Close modal
            checkUserSession(); // Update UI
        } catch (error) {
            alert(error.message || "Login failed.");
        }
    });

    // ✅ Handle Signup
    document.getElementById("signupSubmit").addEventListener("click", async function () {
        const email = document.getElementById("signupEmail").value.trim();
        const username = document.getElementById("signupUsername").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!username) {
            alert("Username is required.");
            return;
        }

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await signupUser(email, username, password);
            alert("Signup successful! Please log in.");
            switchToLogin.click();
        } catch (error) {
            alert(error.message || "Signup failed.");
        }
    });

    // ✅ Handle Logout
    logoutButton.addEventListener("click", function () {
        deleteCookie("isUserAuth");
        deleteCookie("username");
        alert("You have logged out successfully.");
        checkUserSession();
    });








    // ***********************************
    // Product Fetchinf data Work
    // ***********************************

    const compareSection = document.getElementById("compareSection");
    

    // Fetching Data
    async function fetchProductData(productName) {
        try {
            const response = await axios.get(`${BASE_URL}/product`, {
                params: { productName } // ✅ Send as query parameter
            });
            compareSection.style.display = "flex";
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    }

    function displayProductData(product) {
        // Product Details Section
        const productDetails = `
            <div class="product_details">
                <img class="product_image" src="${product.image}" alt="${product.name}" />
                <h3 class="product_name">${product.name}</h3>
                <div class="specifications_container">
                    ${Object.entries(product.specifications).map(([key, value]) => `
                        <div class="product_specifications">
                            <p class="specifications_key" >${key}</p>
                            <p class="specifications_value" >${value}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    
        // Listings Section
        const listingsSection = `
            <div class="listings_container">
                ${product.listings.map(listing => `
                    <div class="listing_box">
                        <h4 class="listing_platform">${listing.platform}</h4>
                        <p class="listing_price"><strong>Price:</strong> $${listing.price}</p>
                        <p class="listing_availability"><strong>Availability:</strong> ${listing.availability}</p>
                        <p class="listing_rating"><strong>Rating:</strong> ${listing.rating} (${listing.reviewCount} reviews)</p>
                    </div>
                `).join('')}
            </div>
        `;

        // <a class="listing_box" href="${listing.link}" target="_blank">View on ${listing.platform}</a>

    
        // Combine both sections
        compareSection.innerHTML = `
            ${productDetails}
            ${listingsSection}
        `;
    }

    // Attach event listeners to buttons
    document.getElementById("iphone14").addEventListener("click", async () => {
        const productData = await fetchProductData("iPhone 14");
        if (productData) displayProductData(productData[0]);
    });

    document.getElementById("iphone15").addEventListener("click", async () => {
        const productData = await fetchProductData("iPhone 15 Pro Max");
        if (productData) displayProductData(productData[0]);
    });

    document.getElementById("iphone16").addEventListener("click", async () => {
        const productData = await fetchProductData("iPhone 16 Pro Max");
        if (productData) displayProductData(productData[0]);
    });

    document.getElementById("imacM2").addEventListener("click", async () => {
        const productData = await fetchProductData("iMac M2");
        if (productData) displayProductData(productData[0]);
    });

    document.getElementById("imacM4").addEventListener("click", async () => {
        const productData = await fetchProductData("iMac M4");
        if (productData) displayProductData(productData[0]);
    });
    document.getElementById("iPadPro").addEventListener("click", async () => {
        const productData = await fetchProductData("iPad Pro");
        if (productData) displayProductData(productData[0]);
    });
    document.getElementById("AppleWatchSeries10").addEventListener("click", async () => {
        const productData = await fetchProductData("Apple Watch Series 10");
        if (productData) displayProductData(productData[0]);
    });
    document.getElementById("AirPodsPro2ndGen").addEventListener("click", async () => {
        const productData = await fetchProductData("AirPods Pro 2nd Gen");
        if (productData) displayProductData(productData[0]);
    });
    document.getElementById("AirPods3rdGen").addEventListener("click", async () => {
        const productData = await fetchProductData("AirPods 3rd Gen");
        if (productData) displayProductData(productData[0]);
    });
});
