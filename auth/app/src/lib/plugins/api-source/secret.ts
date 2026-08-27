import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto"

function getKey(
  key: string,
) {
  const buffer =
    Buffer.from(
      key,
      "hex",
    )

  if (buffer.length !== 32) {
    throw new Error(
      "INTEGRATION_ENCRYPTION_KEY must be 32 bytes encoded as 64 hexadecimal characters",
    )
  }

  return buffer
}

export function encryptApiSecret(
  plaintext: string,
  encryptionKey: string,
) {
  const iv =
    randomBytes(12)

  const cipher =
    createCipheriv(
      "aes-256-gcm",
      getKey(encryptionKey),
      iv,
    )

  const ciphertext =
    Buffer.concat([
      cipher.update(
        plaintext,
        "utf8",
      ),
      cipher.final(),
    ])

  const tag =
    cipher.getAuthTag()

  return [
    "v1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".")
}

export function decryptApiSecret(
  value: string,
  encryptionKey: string,
) {
  const [
    version,
    ivValue,
    tagValue,
    ciphertextValue,
  ] =
    value.split(".")

  if (
    version !== "v1" ||
    !ivValue ||
    !tagValue ||
    !ciphertextValue
  ) {
    throw new Error(
      "Invalid encrypted secret format",
    )
  }

  const decipher =
    createDecipheriv(
      "aes-256-gcm",
      getKey(encryptionKey),
      Buffer.from(
        ivValue,
        "base64url",
      ),
    )

  decipher.setAuthTag(
    Buffer.from(
      tagValue,
      "base64url",
    ),
  )

  const plaintext =
    Buffer.concat([
      decipher.update(
        Buffer.from(
          ciphertextValue,
          "base64url",
        ),
      ),
      decipher.final(),
    ])

  return plaintext.toString(
    "utf8",
  )
}
