"use client"

import { Card, CardBody, CardHeader } from "@heroui/react"
import { useState } from "react";
import TranslationModal from "./TranslationModal";
import { highlightSentenceInPassage } from "../../../utils/utils";
 

interface PassageViewProps {
  title: string;
  content: string;
  highlight: string;
  text: string;
  section: string;
  target: string;
  queryTarget: string | undefined;
  commonLemmas?: string[] | undefined;
  tokenHighlight?: string | undefined;
}

export default function PassageView(props: PassageViewProps) {

  const [isScrollable, setIsScrollable] = useState(false);
  const newTokenHighlight = (props.tokenHighlight === "bg-red-200") ? "bg-red-200" :  "bg-yellow-300";
  const commonLemmaList = props.commonLemmas ? props.commonLemmas : [];
  
  return (
    <div>
      <Card 
        className={isScrollable ? 
          "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[70vh] overflow-y-auto flex flex-col" 
          : "bg-slate-100 px-1 py-3 max-w-[62vh] flex flex-col"
        } 
        shadow="none" 
        radius="none"
      >
        <CardHeader className="flex flex-col gap-2 items-start">
          <h4 className="font-bold text-large">{props.title}</h4>
          <div className='flex flex-row gap-4 justify-center'>
            <button onClick={() => setIsScrollable(!isScrollable)}
              className="text-xs text-gray-500 hover:text-blue-500"
            >
              { isScrollable ? "Remove Scroll" : "Make Scrollable" }
            </button>
            <TranslationModal text={props.text} section={props.section} />
          </div>
        </CardHeader>
        <CardBody className="overflow-y-auto whitespace-pre-wrap">
          <p className="text-m">
            {highlightSentenceInPassage(props.highlight, props.content, props.target, newTokenHighlight, commonLemmaList)}
          </p> 
        </CardBody>
      </Card>
    </div>
  )
}