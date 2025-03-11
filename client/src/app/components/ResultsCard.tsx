"use client";

import { Accordion, AccordionItem, Card, Divider, Tab, Tabs } from "@heroui/react";
import { textFiles } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { useTextSectionContext } from "../contexts/TextSectionContext";
import PassageView from "./PassageView";
import AlignedResult from "./AlignedResult";
import { escapeText, highlightTokenInSentence } from "../../../utils/utils";
import AboutResultsModal from "./AboutResultsModal";
import ScoreDistribution from "./ScoreDistribution";
import { lemmatize } from "../../../utils/api";

interface ResultsCardProps {
  data: ResultItem[];
  scores: number[];
  submittedText: { queryText: string; targetWord: string } | null;
  displayResults: boolean;
  onToggleDisplay: () => void;
  roundScore: (score: number) => string;
}

export default function ResultsCard({
  data,
  scores,
  submittedText,
  displayResults,
  onToggleDisplay,
  roundScore,
}: ResultsCardProps) {

  const [isScrollable, setIsScrollable] = useState(false);
  const [itemStates, setItemStates] = useState<Record<string, Section>>({});
  const { loadSections } = useTextSectionContext();
  const [dataList, setDataList] = useState(data);
  const [loading, setLoading] = useState(false);
  const [tokenLoad, setTokenLoad] = useState(false);

  useEffect(() => {
    const resultTokens = dataList.map((item) => item.token).join(" ");
    const fetchHighlights = async () => {
      try {
        const highlights = await lemmatize({ query: escapeText(submittedText?.targetWord), result: resultTokens});
        const highlightSet = new Set(highlights.output);
        const updatedList = await Promise.all(
          dataList.map(async (item) => {
            try {
              const highlight = (highlightSet.has(item.token)) ? "bg-yellow-300" : "bg-red-200";
              return {...item, tokenHighlight: highlight}
            } catch (error) {
              console.error(error);
              return {...item, tokenHighlight: "bg-red-200"}
            }
          })
        );
        setDataList(updatedList);
      } catch (error) {
        console.error("Error fetching lemmatized data:", error);
      } finally {
        setTokenLoad(true);
      }
    };
  
    fetchHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!tokenLoad) return;
    setLoading(true);
    const fetchLemmaData = async () => {
      try {
        const updatedList = await Promise.all(
          dataList.map(async (item) => {
            try {
              const response = await lemmatize({query: escapeText(submittedText?.queryText), result: escapeText(item.sentence)});
              return {...item, commonLemmas: response.output}
            } catch (error) {
              console.error(error);
              return {...item, commonLemmas: []}
            }
          })
        );
        setDataList(updatedList);
      } catch (error) {
        console.error("Error fetching lemmatized data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLemmaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenLoad]);
  

  const handleAccordionToggle = async (section: string, document: string, index: number) => {
    if (!itemStates[index]?.content) {
      const currText = textFiles.find((text) => text.value === document);
      if (currText) {
        const loadedSections = await loadSections(currText.value, currText.label);
        const sectionContent = loadedSections.find((sec) => sec.indexLabel === section)?.content || "";

        setItemStates((prev) => ({
          ...prev,
          [index]: {
            title: currText.label,
            indexLabel: section,
            content: sectionContent,
          },
        }));
      }
    }
  };

  const cardClass = isScrollable ? 
    "bg-slate-100 p-4 max-w-[62vh] max-h-[70vh] overflow-x-auto overflow-y-auto flex flex-col" 
    : "bg-slate-100 p-4 max-w-[62vh] flex flex-col" ;


  const cardButtons = 
    displayResults ?
      <div className='flex flex-row gap-4 justify-center'>
        <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
          Hide Results
        </button>
        <button onClick={() => setIsScrollable(!isScrollable)}
          className="text-sm text-blue-500 hover:text-gray-500 pb-4">
          { isScrollable ? "Remove Scroll" : "Make Scrollable" }
        </button>
        <AboutResultsModal />
      </div>
    : 
    <button onClick={onToggleDisplay} className="text-sm text-blue-500 hover:text-gray-500 pb-4">
      Show Results
    </button>

  const getScoreClass = (score: number) => {
    const ranges = [
      { min: 0.8, color: "text-green-600", description: "High Similarity" }, 
      { min: 0.5, color: "text-yellow-600", description: "Moderate Similarity" }, 
      { min: 0.3, color: "text-orange-600", description: "Low Similarity" }, 
      { min: 0.0, color: "text-red-600", description: "Very Low/No Similarity" }, 
      { min: -1.0, color: "text-gray-600", description: "No Similarity" }, 
    ];

    return ranges.find(range => score >= range.min);
  }

  const loadedResults = 
    <div>
      { displayResults ? 
        <Card className={cardClass} shadow="none" radius="none">
          {cardButtons}
          <p><strong>Query Context:</strong> {submittedText?.queryText}</p>
          <p><strong>Target Word:</strong> {submittedText?.targetWord}</p>
          <Divider className="my-4" />
          {loading ? <p className="text-sm">Loading common lemmas...</p> : null}
          <Tabs aria-label="Options" variant="underlined">
            <Tab key="results" title="Full Results">
              <Accordion selectionMode="multiple">
                {dataList.map((item, index) => (
                  <AccordionItem
                    key={index}
                    title={
                      <p className="text-xs font-semibold py-1">
                        {textFiles.find(text => text.value === item.document)?.label}: {item.section}
                      </p>
                    }
                    subtitle={
                      <div className="whitespace-normal text-black">
                        {highlightTokenInSentence(item.sentence, item.token, item.tokenHighlight)}
                        <p className="text-xs font-semibold pt-1 text-gray-500">
                          Similarity: <span className={`${getScoreClass(item.score)?.color}`}>
                            {roundScore(item.score)}
                          </span> 
                          {/* ({getScoreClass(item.score)?.description}) */}
                        </p>
                      </div>
                    }
                    textValue={`${textFiles.find(text => text.value === item.document)?.label}: ${item.section}`}
                    onPress={() => handleAccordionToggle(item.section, item.document, index)}
                  >
                    {itemStates[index]?.content ? (
                      <PassageView
                        title={`${itemStates[index].title}: ${item.section}`}
                        content={itemStates[index].content}
                        highlight={item.sentence}
                        text={itemStates[index].title}
                        section={item.section}
                        target={item.token}
                        queryTarget={submittedText?.targetWord}
                        commonLemmas={item.commonLemmas}
                        tokenHighlight={item.tokenHighlight}
                      />
                    ) : (
                      <p>Loading content...</p>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </Tab>
            <Tab key="distribution" title="Similarity Distribution">
              <ScoreDistribution results={data} scores={scores} />
            </Tab>
            <Tab key="aligned" title="Aligned Results">
              <AlignedResult results={dataList} submittedText={submittedText} />
            </Tab>
          </Tabs>
        </Card>
        : 
        <button onClick={onToggleDisplay} className='text-sm text-blue-500 hover:text-gray-500'>
          Show Results
        </button>
      } 
    </div>

  return loadedResults;
}
