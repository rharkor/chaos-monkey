import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"
import { basePoints, damagePerHit } from "@/types/constants"

export const getNodes = async ({ ctx: { session } }: apiInputFromSchema<undefined>) => {
  try {
    ensureLoggedIn(session)

    const nodes = await prisma.node.findMany({
      include: {
        pingResults: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof getNodesResponseSchema>> = {
      nodes: nodes.map((node) => {
        const points =
          basePoints -
          damagePerHit *
            node.pingResults.filter((result) => parseInt(result.status) < 200 || parseInt(result.status) >= 300).length
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

export const getSession = async ({ ctx: { session } }: apiInputFromSchema<undefined>) => {
  try {
    ensureLoggedIn(session)

    const sessionData = await prisma.session.findFirst()
    if (!sessionData) throw new Error("Session not found")
    return sessionData
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
