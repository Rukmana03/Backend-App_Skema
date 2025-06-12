const { createUserSchema } = require('../validations/userValidation');

const testCases = [
    {
        name: "✅ Valid input",
        data: {
            username: "john_doe",
            email: "john@example.com",
            password: "Secure123", 
            role: "Student",
            name: "John Doe",
            identityNumber: "1234567890",
            bio: "Just a student.",
            profilePhoto: "https://example.com/profile.jpg",
        },
    },
    {
        name: "❌ Empty all compulsory fields",
        data: {
            username: "",
            email: "",
            password: "",
            role: "",
        },
    },
    {
        name: "❌ The email format is wrong, the password is too short, the role is invalid",
        data: {
            username: "john",
            email: "wrong-email",
            password: "123",
            role: "Guru", // ❌
        },
    },
    {
        name: "❌ Password has a space",
        data: {
            username: "jane_doe",
            email: "jane@example.com",
            password: "Secure 123", // ❌ 
            role: "Teacher",
        },
    },
];

for (const testCase of testCases) {
    const { error } = createUserSchema.validate(testCase.data, { abortEarly: false });
    console.log(`\n${testCase.name}`);
    if (error) {
        error.details.forEach((detail) => {
            console.log(`  ❌ ${detail.message}`);
        });
    } else {
        console.log("  ✅ Passed validation");
    }
}
