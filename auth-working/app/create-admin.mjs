import { auth } from "./src/lib/auth.ts"

const user = await auth.api.createUser({
  body: {
    email: "aaron@mccarthysirishpub.com",
    password: process.env.ADMIN_PASSWORD,
    name: "Admin",
    role: "admin",
  },
})

console.log(user)
