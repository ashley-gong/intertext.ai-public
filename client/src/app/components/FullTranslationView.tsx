"use client";

import { CardHeader, Card, CardBody } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

interface TranslationProps {
  text: string;
  section: string;
}

export default function FullTranslationView({
  text,
  section,
}: TranslationProps) {
  const [isScrollable, setIsScrollable] = useState(false);
  const { data, loading } = useTranslation(text, section, true);

  return (
    <div>
      <Card
        className={
          isScrollable
            ? "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[70vh] overflow-y-auto flex flex-col"
            : "bg-slate-100 px-1 py-3 max-w-[62vh] max-h-[100vh] overflow-y-auto flex flex-col"
        }
        shadow="none"
        radius="none"
      >
        <CardHeader className="flex flex-col gap-2 items-start">
          <h4 className="font-bold text-large">{text}</h4>
          <div className="flex flex-row gap-4 justify-center">
            <button
              onClick={() => setIsScrollable(!isScrollable)}
              className="text-xs text-gray-500 hover:text-blue-500"
            >
              {isScrollable ? "Remove Scroll" : "Make Scrollable"}
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
