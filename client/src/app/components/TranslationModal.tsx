"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useDraggable,
} from "@heroui/react";
import { useRef } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface ModalProps {
  text: string;
  section: string;
}

export default function TranslationModal({ text, section }: ModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
  const { data, loading } = useTranslation(text, section, false);

  return (
    <>
      <button
        onClick={onOpen}
        className="text-xs text-gray-500 hover:text-blue-500"
      >
        Translation
      </button>
      <Modal
        ref={targetRef}
        backdrop="transparent"
        radius="none"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-h-[60vh] overflow-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                {text}
              </ModalHeader>
              <ModalBody className="whitespace-pre-wrap">
                <p>{loading ? "Loading..." : data}</p>
              </ModalBody>
              <ModalFooter>
                <p className="text-xs text-gray-400">
                  Translations from Perseus Scaife Viewer (2024)
                </p>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
