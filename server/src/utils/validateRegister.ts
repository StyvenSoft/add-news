import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    if (options.email.includes("@")) {
        return {
            errors: [
                {
                    field: "email",
                    message: "Invalid email"
                },
            ],
        };
    }

    if (options.username.length <= 2) {
        return {
            errors: [
                {
                    field: "username",
                    message: "Lenght must be greater than 2"
                },
            ],
        };
    }

    if (options.username.includes("@")) {
        return {
            errors: [
                {
                    field: "username",
                    message: "Cannot include an @"
                },
            ],
        };
    }

    if (options.password.length <= 3) {
        return {
            errors: [
                {
                    field: "password",
                    message: "Lenght must be greater than 3"
                },
            ],
        };
    }

    return null;
}