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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const BASE_URL = "https://smart-compare-backend.vercel.app/api"; 
    // const BASE_URL = "http://localhost:3001/api";

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
        const profileImage = localStorage.getItem("profileImage");

        if (isUserAuth) {
            loginButton.style.display = "none";
            signupButton.style.display = "none";
            userNameDisplay.innerText = `${username}`;
            userDisplay.style.display = "flex";
            logoutButton.style.display = "none";
            if (profileImage) {
                document.querySelector(".userImage").src = profileImage;
            } else {
                document.querySelector(".userImage").src = "./stuff/userImage.png";
            }
        } else {
            loginButton.style.display = "inline";
            signupButton.style.display = "inline";
            userDisplay.style.display = "none";
            logoutButton.style.display = "none";
        }
    }

    checkUserSession();

    switchToSignup.addEventListener("click", () => {
        loginForm.style.display = "none";
        signupForm.style.display = "flex";
        authTitle.innerText = "Sign Up";
    });

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

    [loginButton, signupButton].forEach((btn) => {
        btn.addEventListener("click", () => {
            authModal.style.display = "flex";
        });
    });

    // [searchInput, searchBtn].forEach((element) => {
    //     element.addEventListener("click", () => {
    //         if (!getCookie("isUserAuth")) {
    //             loginForm.style.display = "flex";
    //             signupForm.style.display = "none";
    //             authTitle.innerText = "Login";
    //             authModal.style.display = "flex";
    //         }
    //     });
    // });

    closeModal.addEventListener("click", () => {
        authModal.style.display = "none";
    });

    userDisplay.addEventListener("click", () => {
        logoutButton.style.display = logoutButton.style.display === "inline" ? "none" : "inline";
    });

    async function loginUser(email, password) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Login request failed" };
        }
    }

    async function signupUser(email, username, password, profileImage) {
        try {
            const response = await axios.post(`${BASE_URL}/auth/signup`, { email, username, password, profileImage });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Signup request failed" };
        }
    }

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

            localStorage.setItem("profileImage", response.user.profileImage);

            authModal.style.display = "none";
            checkUserSession();
        } catch (error) {
            alert(error.message || "Login failed.");
        }
    });

    document.getElementById("signupSubmit").addEventListener("click", async function () {
        const email = document.getElementById("signupEmail").value.trim();
        const username = document.getElementById("signupUsername").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const profileImage = document.getElementById("profileImage").files[0];

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

        if (!profileImage) {
            alert("Please upload a profile image.");
            return;
        }

        try {

            const reader = new FileReader();
            reader.readAsDataURL(profileImage);
            reader.onloadend = async () => {
                const base64Image = reader.result;

                await signupUser(email, username, password, base64Image);
                alert("Signup successful! Please log in.");
                switchToLogin.click();
            }

            reader.onerror = () => {
                alert("Error reading the image file.");
            };
            
        } catch (error) {
            alert(error.message || "Signup failed.");
        }
    });

    logoutButton.addEventListener("click", function () {
        deleteCookie("isUserAuth");
        deleteCookie("username");
        localStorage.removeItem("profileImage");
        alert("You have logged out successfully.");
        checkUserSession();
    });








    // ***********************************
    // Product Fetchinf data Work
    // ***********************************

    const compareSection = document.getElementById("compareSection");
    const trending_devies_container = document.getElementById("trending_devies_container");
    

    async function fetchProductData(productName) {
        try {
            const response = await axios.get(`${BASE_URL}/product`, {
                params: { productName }
            });
            compareSection.style.display = "flex";
            return response.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    }

    function displayProductData(product) {
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
    
        const listingsSection = `
            <div class="listings_container">
                ${product.listings.map(listing => `
                    <div class="listing_box">
                        <div class="listing_plat_visit">
                            <p class="listing_platform"><strong>${listing.platform}</strong></p>
                            <a class="listing_platform_cta" href="${listing.link}" target="_blank">Visit</a>
                        </div>
                        <p class="listing_price"><strong>Price:</strong> £${listing.price}</p>
                        <p class="listing_availability"><strong>Availability:</strong> ${listing.availability}</p>
                        <p class="listing_rating"><strong>Rating:</strong> ${listing.rating} (${listing.reviewCount} reviews)</p>
                    </div>
                `).join('')}
            </div>
        `;

    
        compareSection.innerHTML = `
            ${productDetails}
            ${listingsSection}
        `;
    }

    searchBtn.addEventListener("click", async () => {
        const searchTerm = searchInput.value.trim();
    
        if (!searchTerm) {
            alert("Please enter a product name to search.");
            return;
        }
    
        const productData = await fetchProductData(searchTerm);
    
        if (productData && productData.length > 0) {
            displayProductData(productData[0]);
            scrollToCompareSection();
        } else {
            compareSection.innerHTML = "<p>No products found matching your search.</p>";
            compareSection.style.display = "flex";
            scrollToCompareSection();
        }
    });
    
    searchInput.addEventListener("keyup", async (event) => {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
    
            if (!searchTerm) {
                alert("Please enter a product name to search.");
                return;
            }
    
            const productData = await fetchProductData(searchTerm);
    
            if (productData && productData.length > 0) {
                displayProductData(productData[0]);
                scrollToCompareSection();
            } else {
                compareSection.innerHTML = "<p>No products found matching your search.</p>";
                compareSection.style.display = "flex";
                scrollToCompareSection();
            }
        }
    });
    
    function scrollToCompareSection() {
        trending_devies_container.scrollIntoView({
            behavior: "smooth"
        });
    }

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
    document.getElementById("AirPods4thGen").addEventListener("click", async () => {
        const productData = await fetchProductData("AirPods 4th Gen");
        if (productData) displayProductData(productData[0]);
    });
});
