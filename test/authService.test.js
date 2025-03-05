const { registerUser } = require('../services/authService');

describe("Register User Validation", () => {
    test("should fail if required fields are missing", async () => {
        await expect(registerUser({})).rejects.toEqual({
            status: 400, 
            message: "All fields are required"
        });
    });

    test("should fail if passwords do not match", async () => {
        await expect(registerUser({
            username: "testuser",
            email: "test@example.com",
            password: "S2@/}shwn2",
            confirmPassword: "S2@/}shwn2"
        })).rejects.toEqual({
            status: 400, 
            message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character"
        });
    });
});
