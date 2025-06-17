"use client";

import { useState } from "react";
import { Textarea, Input, Select, SelectItem } from "@heroui/react";
import { query } from "../../../utils/api";
import PassageViewContent from "./PassageViewContent";
import ResultsCard from "./ResultsCard";
import { textFiles } from "../../../utils/constants";
import { useTimer } from "../hooks/useTimer";

export default function NearestNeighborQuery() {
  const [queryText, setQueryText] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [submittedText, setSubmittedText] = useState<{
    queryText: string;
    targetWord: string;
  } | null>(null);
  const [displayResults, setDisplayResults] = useState(true);
  const [data, setData] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);
  const [numberResults, setNumberResults] = useState("");
  const [queryError, setQueryError] = useState(false);
  const [targetTexts, setTargetTexts] = useState<string[]>([]);

  const {
    timers,
    isTimerRunning,
    isManuallyStarted,
    startTimer,
    stopTimer,
    resetTimers,
    handleMouseEnter,
    handleMouseLeave,
  } = useTimer();

  const textDropdown = (
    <>
      <Select
        label="Select Text Filters (optional)"
        onChange={(e) => {
          setTargetTexts(e.target.value.split(","));
        }}
        selectionMode="multiple"
        selectedKeys={targetTexts}
        className="max-w-[400px] overflow-hidden truncate"
      >
        {textFiles.map((file) => (
          <SelectItem key={file.value}>{file.label}</SelectItem>
        ))}
      </Select>
    </>
  );

  const handleSubmit = async () => {
    setSubmittedText({ queryText, targetWord });
    setLoading(true);
    setDoneLoading(false);
    const dataToSend = {
      targetWord: targetWord.toLowerCase(),
      queryText: queryText,
      numberResults: numberResults,
      targetTexts: targetTexts,
    };
    try {
      setLoading(true);
      const responseData = await query(dataToSend);
      setData(responseData.output);
      setScores(responseData.tophundred);
      setDoneLoading(true);
      setLoading(false);
      setDisplayResults(true);
    } catch (error) {
      console.error("Error:", error);
      setQueryError(true);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQueryText("");
    setTargetWord("");
    setTargetTexts([]);
    setLoading(false);
    setDoneLoading(false);
    setQueryError(false);
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      stopTimer();
    } else {
      startTimer("query");
    }
  };

  const roundScore = (score: number) => {
    const upperBoundedScore = score > 1 ? 1 : score;
    const lowerBoundedScore = upperBoundedScore < 0 ? 0 : upperBoundedScore;
    return lowerBoundedScore.toFixed(3);
  };

  const resultMessage = () => {
    if (loading) {
      return <div>Loading...</div>;
    } else {
      if (doneLoading) {
        return <div>Success! Wait for results in single/query view.</div>;
      } else if (queryError) {
        return (
          <div>
            Failed to fetch! Double check your query and target word such that:
            <ul className="list-disc text-xs whitespace-normal">
              <li>Neither fields are empty.</li>
              <li>Your target word appears in your query.</li>
              <li>
                Your query does not include MORE than one sentence (period,
                question mark, exclamation).
              </li>
              <li>
                If your target word is adjacent to a SINGLE quote (e.g.
                &apos;nate) or to punctuation and a SINGLE quote (e.g.
                sequamur.&apos;), include them in your target word! (Bug to be
                fixed)
              </li>
              <li>
                In some situations, try a word in a different case than it
                appears in the query (e.g. nominative).
              </li>
              <li>
                In some cases (particularly in poetry), you may need to limit
                your query to one line (but not always).
              </li>
            </ul>
          </div>
        );
      } else {
        return <div></div>;
      }
    }
  };

  return (
    <div className="flex flex-row row-start-2 items-start sm:items-start gap-1 w-full">
      <div className="w-4/5">
        <PassageViewContent
          querySent={doneLoading}
          querySentence={queryText}
          queryWord={targetWord}
        >
          {submittedText && (
            <ResultsCard
              data={data}
              scores={scores}
              submittedText={submittedText}
              displayResults={displayResults}
              onToggleDisplay={() => setDisplayResults(!displayResults)}
              roundScore={roundScore}
            />
          )}
        </PassageViewContent>
      </div>
      <div className="w-1/5">
        <div
          className="flex flex-col md:flex-nowrap gap-y-4 pl-4"
          onMouseEnter={() => handleMouseEnter("query")}
          onMouseLeave={handleMouseLeave}
        >
          <h1 className="font-semibold text-xl">
            Contextual Nearest Neighbors Queries
          </h1>
          <p className="text-xs">
            Model:
            <a
              href="https://arxiv.org/pdf/2009.10053"
              className="hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Latin BERT{" "}
            </a>
            (Bamman and Burns 2020)
          </p>
          <Textarea
            isMultiline
            size="lg"
            label="Query Context"
            placeholder="Enter the phrase/sentence in which your target word appears."
            description="Highlight from left text for best results. Do not input more than one sentence (ended by period, question mark, exclamation mark, etc.)."
            className="max-w-lg text-sm"
            radius="none"
            variant="bordered"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
          <Input
            isClearable
            size="lg"
            type="text"
            variant="underlined"
            placeholder="Target Word (Query)"
            description="Enter the word for which you want to find similar usages."
            radius="none"
            className="max-w-lg"
            value={targetWord}
            onClear={() => setTargetWord("")}
            onChange={(e) => setTargetWord(e.target.value)}
          />
          <Input
            isClearable
            size="lg"
            type="text"
            variant="underlined"
            placeholder="Number of Results"
            description="The default number (if this field is left empty) is 5. The maximum number is 30."
            radius="none"
            className="max-w-lg"
            value={numberResults}
            onClear={() => setNumberResults("")}
            onChange={(e) => setNumberResults(e.target.value)}
            isInvalid={Number(numberResults) > 30}
            errorMessage="Number of results cannot exceed 30."
          />
          {textDropdown}
          <div className="flex flex-row gap-4">
            <button
              onClick={handleSubmit}
              className="w-1/2 p-2 bg-blue-500 hover:bg-blue-300 text-white text-sm rounded"
            >
              Submit
            </button>
            <button
              onClick={handleClear}
              className="w-1/2 p-2 text-red-600 hover:text-red-900 text-sm"
            >
              Clear Query (and Results)
            </button>
          </div>
          {resultMessage()}
        </div>
        <div className="text-xs pl-4 pt-2">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xs font-semibold">Query Timer</h3>
            <span
              className={`text-xs ${
                isManuallyStarted ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isManuallyStarted ? "(Started)" : "(Not Started)"}
            </span>
          </div>
          <p>Query Time: {timers.query}s</p>
          <button onClick={toggleTimer} className="pr-2 hover:text-blue-500">
            {isManuallyStarted
              ? isTimerRunning
                ? "Stop Timer"
                : "Start Timer"
              : "Start Timer"}
          </button>
          <button onClick={resetTimers} className="hover:text-blue-500">
            Reset Timer
          </button>
        </div>
      </div>
    </div>
  );
}
