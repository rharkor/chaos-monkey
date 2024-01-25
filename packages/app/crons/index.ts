//! HERE WE ONLY USE INDIVIUAL CRON JOBS
//? Global cron jobs need to be handle in their own package.
// Exemple: If you're using a cron job to send a newsletter,
// you should not handle it here unless you are sure that it will be only one instance of the app.

import { CronJob } from "cron"
import { config } from "dotenv"

import { prisma } from "@/lib/prisma"
import { logger } from "@lib/logger"

import { pingPromise } from "./utils"
config()

new CronJob(
  //* Every 30 seconds
  "*/30 * * * * *",
  async () => {
    const maxDurationWarning = 1000 * 60 * 5 // 5 minutes
    const name = "Ping nodes"
    const now = new Date()
    //? Do something
    async function pingNodes() {
      const session = await prisma.session.findFirst()
      if (!session || !session.enabled) return
      const nodes = await prisma.node.findMany()
      await Promise.all(
        nodes.map(async (node) => {
          const pingResult = await pingPromise(node.ip)
          logger.debug(`[${now.toLocaleString()}] ${node.name} ping result: ${pingResult}`)
          return prisma.pingResult
            .create({
              data: {
                node: {
                  connect: {
                    id: node.id,
                  },
                },
                status: pingResult.toString(),
              },
            })
            .catch(() => {})
        })
      )
    }
    await pingNodes().catch((err) => {
      logger.error(
        `[${now.toLocaleString()}] ${name} started at ${now.toLocaleString()} and failed after ${
          new Date().getTime() - now.getTime()
        }ms`
      )
      throw err
    })
    const took = new Date().getTime() - now.getTime()
    if (took > maxDurationWarning) logger.warn(`[${now.toLocaleString()}] ${name} took ${took}ms`)
  },
  null,
  true,
  "Europe/Paris"
)
