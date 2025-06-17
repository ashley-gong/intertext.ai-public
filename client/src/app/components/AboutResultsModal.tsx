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
import { useRef } from "react";


export default function AboutResultsModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const targetRef = useRef(null);
  const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen});

  return (
    <>
      <button onClick={onOpen} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
        About Results
      </button>
      <Modal ref={targetRef} backdrop="transparent" radius="none" isOpen={isOpen} onOpenChange={onOpenChange} className="overflow-auto">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col">About Results</ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  In each result, the highlighted word represents the token which is determined to be similar to the target word in the query by the AI model.
                  If the word is highlighted in <span className='bg-red-200'>red</span>, then the result token is not the same word as the target word, possibly indicating more of a contextual or semantic match than an
                  exact vocabulary match. Lemmas from the query text that appear in the result context are emphasized in <span className='text-orange-600 font-semibold'>orange</span>.
                </p>
                <p className="text-sm">
                  The <i>similarity score</i> listed underneath each result in the <i>Full Results</i> view
                  is the <b>cosine similarity</b> between the query target word and the highlighted word in the result, 
                  or the cosine of the angle between the vector embeddings of the query and result target words. 
                </p>
                <p className="text-sm">
                  The AI model used by Intertext.AI, Latin BERT (Bamman and Burns 2020), encodes each Latin word in each text on this platform
                  as a vector, or series of numbers representing where that word lies in a multidimensional space. The cosine similarity is a 
                  quantitative measure of distance between words in this vector space, and higher cosine similarity scores, 
                  which mostly lie between 0 and 1 (rarely down to -1), generally indicate higher semantic similarity between tokens.
                </p>
              </ModalBody>
              <ModalFooter>
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
