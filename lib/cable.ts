import { createConsumer } from "@rails/actioncable"

// Singleton — só instancia no browser
const cable =
  typeof window !== "undefined"
    ? createConsumer(
        process.env.NEXT_PUBLIC_CABLE_URL ?? "ws://localhost:3333/cable"
      )
    : null

export default cable
