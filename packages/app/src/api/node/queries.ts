import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

export const getNodes = async ({}: apiInputFromSchema<undefined>) => {
  try {
    const nodes = await prisma.node.findMany({
      include: {
        pingResults: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    const session = await prisma.session.findFirst()
    if (!session) throw new Error("Session not found")
    const basePoints = session.basePoints

    const data: z.infer<ReturnType<typeof getNodesResponseSchema>> = {
      nodes: nodes.map((node) => {
        const points = basePoints
          ? basePoints -
            node.pingResults
              .filter((result) => parseInt(result.status) < 200 || parseInt(result.status) >= 300)
              .reduce((acc, result) => acc + result.damage, 0)
          : undefined
        return {
          id: node.id,
          name: node.name,
          ip: node.ip,
          results: node.pingResults
            .map((result) => ({
              id: result.id,
              status: result.status,
              createdAt: result.createdAt.toISOString(),
            }))
            .slice(0, 20),
          points,
        }
      }),
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}

export const getSession = async ({}: apiInputFromSchema<undefined>) => {
  try {
    const sessionData = await prisma.session.findFirst()
    if (!sessionData) throw new Error("Session not found")
    return sessionData
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
