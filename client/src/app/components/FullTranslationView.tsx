"use client"

import {
  CardHeader,
  Card,
  CardBody,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { translation } from "../../../utils/api";
import { textFiles } from "../../../utils/constants";

interface TranslationProps {
  text: string;
  section: string;
}

export default function FullTranslationView({ text, section } : TranslationProps) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const urn = textFiles.find((t) => t.label === text)?.translation
      const dataToSend = {
        urn: urn,
        section: section,
        full: "true"
      };
      if (text) {
        const translationText = await translation(dataToSend);
        console.log(translationText);
        if (translationText.content === "Unfortunately, no translation available from Scaife Viewer") {
          const textFile = (textFiles.find((t) => t.label === text)?.value);
          const englishFile = textFile?.replace(/\.txt$/, '_ENG.txt');
          const response = await fetch(`/${englishFile}`);
          const fullText = await response.text();
          setData(fullText);
        } else {
          setData(translationText.content);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [text, section]);

  return (
    <div>
      <Card 
        className={isScrollable ? 
          "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[70vh] overflow-y-auto flex flex-col" 
          : "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[100vh] overflow-y-auto flex flex-col"
        } 
        shadow="none" 
        radius="none"
      >
        <CardHeader className="flex flex-col gap-2 items-start">
          <h4 className="font-bold text-large">{text}</h4>
          <div className='flex flex-row gap-4 justify-center'>
            <button onClick={() => setIsScrollable(!isScrollable)}
              className="text-xs text-gray-500 hover:text-blue-500"
            >
              { isScrollable ? "Remove Scroll" : "Make Scrollable" }
            </button>
          </div>
        </CardHeader>
        <CardBody className="overflow-y-auto whitespace-pre-wrap">
          <p className="text-m">{loading ? "Loading..." : data}</p> 
        </CardBody>
      </Card>
    </div>
  );
}
