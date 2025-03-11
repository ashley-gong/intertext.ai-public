"use client"

import { Card, CardBody, CardHeader } from "@heroui/react"
import { useEffect, useState } from "react";
import { textFiles } from "../../../utils/constants";
import { highlightSentenceInPassage } from "../../../utils/utils";

interface FullPassageViewProps {
  highlight: string;
  text: string;
  token: string;
}

export default function FullPassageView({highlight, text, token}: FullPassageViewProps) {

  const [isScrollable, setIsScrollable] = useState(false);
  const [content, setContent] = useState("");
  const tokenHighlight = "bg-yellow-300";
  
  useEffect(() => {
    const fetchData = async () => {
      const textFile = textFiles.find((t) => t.label === text)?.value;
      const response = await fetch(`/${textFile}`);
      if (!response.ok) throw new Error("Failed to load file");
      const fullText = await response.text();
      setContent(fullText);
    };

    fetchData();
  }, [text]);

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
          <p className="text-m">{highlightSentenceInPassage(highlight, content, token, tokenHighlight, [])}</p> 
        </CardBody>
      </Card>
    </div>
  )
}