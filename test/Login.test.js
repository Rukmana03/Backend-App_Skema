const axios = require("axios");

const testLogin = async (email, password) => {
    for (let i = 1; i <= 6; i++) {
        console.log(`Attempt ${i}: Trying to log in...`);
        try {
            await axios.post("http://localhost:3000/api/auth/login", { email, password });
            console.log("Login successful!");
            break;
        } catch (error) {
            console.log(`Error Attempt ${i}:`, error.response?.data?.message || error.message);
        }
    }
};

// Ganti dengan email yang ada di database
testLogin("rukmana@gmail.com", "wrongpassword");
