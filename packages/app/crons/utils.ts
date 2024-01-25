import http from "http"
import https from "https"

/**
 * Sends a GET request to the specified IP or URL and returns a promise that resolves with the status code.
 * This version follows up to a maximum of 5 redirects.
 * @param {string} ip The IP address or URL to ping.
 * @returns {Promise<number>} A promise that resolves with the status code of the response.
 */
export const pingPromise = (ip: string): Promise<number> => {
  return new Promise((resolve) => {
    // Internal function to handle the request with redirect tracking
    const handleRequest = (url: string, redirectsLeft: number) => {
      if (!url.startsWith("http")) url = `http://${url}` // Add http:// if no protocol is specified
      const protocol = url.startsWith("https") ? https : http

      const request = protocol.get(url, { timeout: 5000 }, (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          if (redirectsLeft > 0) {
            handleRequest(response.headers.location, redirectsLeft - 1) // Follow the redirect
          } else {
            resolve(response.statusCode) // Resolve with status code if too many redirects
          }
        } else {
          resolve(response.statusCode || 0) // Resolve with status code, 0 if undefined
        }
      })

      request.on("error", () => {
        resolve(0)
      })

      request.on("timeout", () => {
        request.destroy()
        resolve(0)
      })

      request.end()
    }

    handleRequest(ip, 5) // Start the request with a maximum of 5 redirects allowed
  })
}
