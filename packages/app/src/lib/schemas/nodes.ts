import * as z from "zod"

import { TDictionary } from "@/lib/langs"

export const addNodeSchema = (dictionary?: TDictionary) =>
  z.object({
    name: z
      .string()
      .min(3, dictionary && dictionary.errors.node.min3)
      .max(30, dictionary && dictionary.errors.node.max30),
    ip: z.string().min(1, dictionary && dictionary.errors.node.ipEmpty),
  })

export const addNodeResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const deleteNodeSchema = () =>
  z.object({
    id: z.string(),
  })

export const deleteNodeResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const updateNodeSchema = (dictionary?: TDictionary) =>
  z.object({
    id: z.string(),
    name: z
      .string()
      .min(3, dictionary && dictionary.errors.node.min3)
      .max(30, dictionary && dictionary.errors.node.max30)
      .optional(),
    ip: z
      .string()
      .min(1, dictionary && dictionary.errors.node.ipEmpty)
      .optional(),
  })

export const updateNodeResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const getNodesResponseSchema = () =>
  z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        ip: z.string(),
        results: z.array(
          z.object({
            id: z.string(),
            status: z.string(),
            createdAt: z.string(),
          })
        ),
        points: z.number(),
      })
    ),
  })

export const getSessionResponseSchema = () =>
  z.object({
    enabled: z.boolean(),
    id: z.string(),
  })

export const updateSessionSchema = () =>
  z.object({
    enabled: z.boolean(),
    id: z.string(),
  })

export const updateSessionResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })

export const deleteSessionResponseSchema = () =>
  z.object({
    success: z.boolean(),
  })
