"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { ModalHeader } from "@/components/ui/modal"
import { useDictionary } from "@/contexts/dictionary/utils"
import { updateSessionSchema } from "@/lib/schemas/nodes"
import { trpc } from "@/lib/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"

const formSchema = updateSessionSchema

export default function UpdateSession() {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()
  const session = trpc.node.getSession.useQuery(undefined)
  const updateSessionMutation = trpc.node.updateSession.useMutation()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema()),
    values: {
      id: session.data?.id ?? "",
      basePoints: session.data?.basePoints ?? 0,
      enabled: session.data?.enabled ?? false,
      damagePerHit: session.data?.damagePerHit ?? 0,
    },
  })

  const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
    await updateSessionMutation.mutateAsync(data)
    onClose()
    utils.node.invalidate()
  }

  useEffect(() => {
    if (!updateSessionMutation.isSuccess) return
    form.reset()
  }, [updateSessionMutation.isSuccess, form])

  return (
    <>
      <Button
        isDisabled={session.isLoading}
        onPress={onOpen}
        isLoading={updateSessionMutation.isLoading}
        color={"warning"}
      >
        {dictionary.updateSession}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{dictionary.updateSession}</ModalHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <FormField
                    name="basePoints"
                    label={dictionary.basePoints}
                    placeholder="1000"
                    form={form}
                    type="number"
                    isRequired
                  />
                  <FormField
                    name="damagePerHit"
                    form={form}
                    type="number"
                    label={dictionary.damagePerHit}
                    placeholder="10"
                    isRequired
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    {dictionary.cancel}
                  </Button>
                  <Button color="primary" type="submit" isLoading={updateSessionMutation.isLoading}>
                    {dictionary.update}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
