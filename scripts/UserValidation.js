const { createUserSchema } = require('../validations/userValidation');

const testCases = [
    {
        name: "✅ Valid input",
        data: {
            username: "john_doe",
            email: "john@example.com",
            password: "Secure123", // ✅ huruf besar, kecil, angka, tanpa spasi
            role: "Student",
            name: "John Doe",
            identityNumber: "1234567890",
            bio: "Just a student.",
            profilePhoto: "https://example.com/profile.jpg",
        },
    },
    {
        name: "❌ Kosong semua field wajib",
        data: {
            username: "",
            email: "",
            password: "",
            role: "",
        },
    },
    {
        name: "❌ Format email salah, password terlalu pendek, role tidak valid",
        data: {
            username: "john",
            email: "salah-email",
            password: "123",
            role: "Guru", // ❌ bukan 'Admin', 'Teacher', 'Student'
        },
    },
    {
        name: "❌ Password ada spasi",
        data: {
            username: "jane_doe",
            email: "jane@example.com",
            password: "Secure 123", // ❌ spasi
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
