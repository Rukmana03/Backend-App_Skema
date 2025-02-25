const authService = require("../services/authService");

async function register(req, res) {
    try {
        const { email, password, role, name, identity_number } = req.body;

        if (!email || !password || !role || !name) {
            return res.status(400).json({ error: "Semua field wajib diisi" });
        }

        const user = await authService.registerUser(email, password, role, name, identity_number);
        res.status(201).json({ message: "Registrasi berhasil", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Request body:", req.body);

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ error: "Email dan password wajib diisi" });
        }

        // Gunakan authService.loginUser agar kode lebih bersih
        const user = await authService.loginUser(email, password);
        if (!user) {
            return res.status(400).json({ error: "Email atau password salah" });
        }

        res.json({ message: "Login berhasil", user });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan", detail: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email dan password baru wajib diisi" });
        }

        const message = await authService.resetPassword(email, newPassword);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { register, login, resetPassword };
