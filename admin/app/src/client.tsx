import { StartClient } from "@tanstack/react-start/client"
import { hydrateRoot } from "react-dom/client"

console.log("NiteOwl client entry executing")

hydrateRoot(document, <StartClient />)
