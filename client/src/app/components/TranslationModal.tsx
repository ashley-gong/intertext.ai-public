"use client"

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
import { useEffect, useRef, useState } from "react";
import { translation } from "../../../utils/api";
import { textFiles } from "../../../utils/constants";

interface ModalProps {
  text: string;
  section: string;
}

export default function TranslationModal({ text, section } : ModalProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const targetRef = useRef(null);
  const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen});
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const urn = textFiles.find((t) => t.label === text)?.translation
      const dataToSend = {
        urn: urn,
        section: section,
        full: "false"
      };
      if (text) {
        const translationText = await translation(dataToSend);
        setLoading(false);
        if (translationText.content === "Unfortunately, no translation available from Scaife Viewer") {
          const textFile = (textFiles.find((t) => t.label === text)?.value);
          const englishFile = textFile?.replace(/\.txt$/, '_ENG.txt');
          const response = await fetch(`/${englishFile}`);
          const fullText = await response.text();
          setData(fullText);
        } else {
          setData(translationText.content);
        }
      }
    };

    fetchData();
  }, [text, section]);

  return (
    <>
      <button onClick={onOpen} className="text-xs text-gray-500 hover:text-blue-500">
        Translation
      </button>
      <Modal ref={targetRef} backdrop="transparent" radius="none" isOpen={isOpen} onOpenChange={onOpenChange} className="max-h-[60vh] overflow-auto">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">{text}</ModalHeader>
              <ModalBody className="whitespace-pre-wrap">
                <p>{loading ? "Loading..." : data}</p>
              </ModalBody>
              <ModalFooter>
                <p className="text-xs text-gray-400">Translations from Perseus Scaife Viewer (2024)</p>
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
