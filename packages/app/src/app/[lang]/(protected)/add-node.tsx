"use client"

import { useEffect } from "react"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { useDictionary } from "@/contexts/dictionary/utils"
import { addNodeSchema } from "@/lib/schemas/nodes"
import { trpc } from "@/lib/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"

const formSchema = addNodeSchema

export default function AddNode() {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const addNodeMutation = trpc.node.addNode.useMutation()

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(dictionary)),
    defaultValues: {
      name: "",
      ip: "",
    },
  })

  const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
    await addNodeMutation.mutateAsync(data)
    utils.node.invalidate()
    onClose()
  }

  useEffect(() => {
    form.reset()
  }, [addNodeMutation.isSuccess, form])

  return (
    <>
      <Button onPress={onOpen} startContent={<Plus className="h-4 w-4 " />} color="primary">
        {dictionary.addNode}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{dictionary.addNode}</ModalHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <FormField name="name" placeholder="Node Name" form={form} type="text" />
                  <FormField name="ip" form={form} type="text" placeholder="0.0.0.0" />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    {dictionary.cancel}
                  </Button>
                  <Button color="primary" type="submit" isLoading={addNodeMutation.isLoading}>
                    {dictionary.create}
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
