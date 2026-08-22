import https from "node:https";

type UnifiRequestOptions = {
  baseUrl: string;
  apiToken: string;
  verifyTls: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
};

export type UnifiApiResponse<T = unknown> = {
  status: number;
  ok: boolean;
  data: T | string | null;
};

export async function unifiRequest<T = unknown>({
  baseUrl,
  apiToken,
  verifyTls,
  method = "GET",
  path,
  body,
}: UnifiRequestOptions): Promise<UnifiApiResponse<T>> {
  const url = new URL(
    path,
    `${baseUrl.replace(/\/+$/, "")}/`,
  );

  if (url.protocol !== "https:") {
    throw new Error("UniFi console URL must use HTTPS");
  }

  const payload =
    body === undefined ? undefined : JSON.stringify(body);

  return await new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method,
        rejectUnauthorized: verifyTls,
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Accept: "application/json",
          ...(payload
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
              }
            : {}),
        },
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(
            Buffer.isBuffer(chunk)
              ? chunk
              : Buffer.from(chunk),
          );
        });

        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");

          let data: unknown = text || null;

          if (text) {
            try {
              data = JSON.parse(text);
            } catch {
              // Preserve raw non-JSON response.
            }
          }

          const status = response.statusCode ?? 0;

          resolve({
            status,
            ok: status >= 200 && status < 300,
            data: data as T | string | null,
          });
        });
      },
    );

    request.on("error", reject);

    if (payload) {
      request.write(payload);
    }

    request.end();
  });
}
