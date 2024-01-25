"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useDictionary } from "@/contexts/dictionary/utils"
import { deleteNodeSchema } from "@/lib/schemas/nodes"
import { trpc } from "@/lib/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"

const formSchema = deleteNodeSchema

export default function DeleteNode({ id, name, ip }: { id: string; name: string; ip: string }) {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const deleteNodeMutation = trpc.node.deleteNode.useMutation()

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema()),
    values: {
      id,
    },
  })

  const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
    await deleteNodeMutation.mutateAsync(data)
    utils.node.invalidate()
    onClose()
  }

  useEffect(() => {
    form.reset()
  }, [deleteNodeMutation.isSuccess, form])

  return (
    <>
      <Button onPress={onOpen} color="danger">
        {dictionary.deleteNode}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{dictionary.deleteNode}</ModalHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <p>{dictionary.deleteNodeConfirmation}</p>
                  <p>
                    {name}
                    <span className="text-muted-foreground ml-2 text-xs">({ip})</span>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    {dictionary.cancel}
                  </Button>
                  <Button color="danger" type="submit" isLoading={deleteNodeMutation.isLoading}>
                    {dictionary.delete}
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
