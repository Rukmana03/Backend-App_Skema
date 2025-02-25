function validateRegister(req, res, next) {
    const { email, password, role, name } = req.body;
    if (!email || !password || !role || !name) {
        return res.status(400).json({ error: "Semua field harus diisi" });
    }
    next();
}

module.exports = { validateRegister };
