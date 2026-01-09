import { getRepositories } from "../lib/repositories"

async function main() {
  try {
    const email = "admin@classroom.dev"
    const password = "password123"
    const role = "admin"

    console.log(`Creating admin user: ${email}`)

    const repos = await getRepositories()

    const existingUser = await repos.users.findByEmail(email)
    if (existingUser) {
      console.log(`User already exists`)
      process.exit(0)
    }

    const user = await repos.users.create(email, password, role)
    console.log(`Admin user created: ${user.id}`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Role: ${role}`)

    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
    process.exit(1)
  }
}

main()
