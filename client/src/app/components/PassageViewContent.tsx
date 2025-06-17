"use client";

import { useState, useEffect, Key } from "react";
import PassageView from "./PassageView";
import PassageSidebar from "./PassageSidebar";
import { textFiles } from "../../../utils/constants";
import { useTextSectionContext } from "../contexts/TextSectionContext";
import { Tab, Tabs } from "@heroui/react";
import FullPassageView from "./FullPassageView";
import FullTranslationView from "./FullTranslationView";
import { useTimer } from "../hooks/useTimer";

interface Props {
  querySent: boolean;
  querySentence: string;
  queryWord: string;
  children?: React.ReactNode;
}

export default function PassageViewContent({
  querySent,
  querySentence,
  queryWord,
  children,
}: Props) {
  const [selectedView, setSelectedView] = useState<Key>("single");
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);

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

  const handleTabChange = (tab: Key) => {
    if (isTimerRunning) {
      stopTimer();
      setSelectedView(tab);
      startTimer(tab.toString());
    }
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      stopTimer();
    } else {
      startTimer(selectedView.toString());
    }
  };

  const {
    leftText,
    setLeftText,
    leftSections,
    setLeftSections,
    rightText,
    setRightText,
    rightSections,
    setRightSections,
    loadSections,
  } = useTextSectionContext();

  useEffect(() => {
    loadSections(leftText.value, leftText.label)
      .then(setLeftSections)
      .catch(console.error);
  }, [leftText, loadSections, setLeftSections]);

  useEffect(() => {
    loadSections(rightText.value, rightText.label)
      .then(setRightSections)
      .catch(console.error);
  }, [loadSections, rightText, setRightSections]);

  const toggleSidebar = () => {
    setIsLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const swapTexts = () => {
    const currLeftText = leftText;
    const currLeftSections = leftSections;
    const currLeftIndex = leftIndex;
    const currRightText = rightText;
    const currRightSections = rightSections;
    const currRightIndex = rightIndex;
    setLeftText(currRightText);
    setLeftSections(currRightSections);
    setLeftIndex(currRightIndex);
    setRightText(currLeftText);
    setRightSections(currLeftSections);
    setRightIndex(currLeftIndex);
  };

  const sidebar = () => {
    switch (selectedView) {
      case "single":
        return (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={leftText.value}
            onTextChange={(value: string, label: string) => {
              setLeftText({ value, label });
              setLeftIndex(0);
            }}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title=""
            onToggleSidebar={toggleSidebar}
          />
        );
      case "dual":
        return !isLeftSidebarVisible ? (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={rightText.value}
            onTextChange={(value: string, label: string) => {
              setRightText({ value, label });
              setRightIndex(0);
            }}
            sections={rightSections}
            selectedIndex={rightIndex}
            onSelectIndex={setRightIndex}
            title="(Right)"
            onToggleSidebar={toggleSidebar}
          />
        ) : (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={leftText.value}
            onTextChange={(value: string, label: string) => {
              setLeftText({ value, label });
              setLeftIndex(0);
            }}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title="(Left)"
            onToggleSidebar={toggleSidebar}
          />
        );
      case "full":
        return (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={leftText.value}
            onTextChange={(value: string, label: string) => {
              setLeftText({ value, label });
              setLeftIndex(0);
            }}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title=""
            onToggleSidebar={toggleSidebar}
          />
        );
    }
  };

  return (
    <div>
      <div
        className="flex min-h-screen"
        onMouseEnter={() => handleMouseEnter(selectedView.toString())}
        onMouseLeave={handleMouseLeave}
      >
        {sidebar()}
        <main className="flex flex-col items-center space-y-4 w-5/6">
          <div className="flex flex-col w-full gap-2">
            <Tabs
              aria-label="Options"
              variant="underlined"
              size="lg"
              onSelectionChange={handleTabChange}
            >
              <Tab key="single" title="Single Text/Query View">
                <div className="flex flex-row gap-2">
                  <div className="flex-1 relative">
                    <div className="sticky top-8">
                      <PassageView
                        title={`${leftSections[leftIndex]?.title}: ${leftSections[leftIndex]?.indexLabel}`}
                        content={leftSections[leftIndex]?.content || ""}
                        highlight={querySentence}
                        text={leftSections[leftIndex]?.title}
                        section={leftSections[leftIndex]?.indexLabel}
                        target={queryWord}
                        queryTarget={queryWord}
                      />
                    </div>
                  </div>
                  {querySent && <div className="flex-1">{children}</div>}
                </div>
              </Tab>
              <Tab key="dual" title="Dual Text View">
                <div className="flex flex-col items-center">
                  <button
                    onClick={swapTexts}
                    className="text-xs hover:text-blue-500 pb-2"
                  >
                    Swap Texts
                  </button>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex-1 relative">
                    <div className="sticky top-8">
                      <PassageView
                        title={`${leftSections[leftIndex]?.title}: ${leftSections[leftIndex]?.indexLabel}`}
                        content={leftSections[leftIndex]?.content || ""}
                        highlight={querySentence}
                        text={leftSections[leftIndex]?.title}
                        section={leftSections[leftIndex]?.indexLabel}
                        target={queryWord}
                        queryTarget={queryWord}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <PassageView
                      title={`${rightSections[rightIndex]?.title}: ${rightSections[rightIndex]?.indexLabel}`}
                      content={rightSections[rightIndex]?.content || ""}
                      highlight=""
                      text={rightSections[rightIndex]?.title}
                      section={rightSections[rightIndex]?.indexLabel}
                      target={queryWord}
                      queryTarget={queryWord}
                    />
                  </div>
                </div>
              </Tab>
              <Tab key="full" title="Full Text/Translation View">
                <div className="flex flex-col items-center">
                  <p className="text-xs pb-2">
                    Translations from Perseus Scaife Viewer (2024)
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="flex-1 relative">
                    <div className="sticky top-8">
                      <FullPassageView
                        highlight={querySentence}
                        text={leftSections[leftIndex]?.title}
                        token={queryWord}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <FullTranslationView
                      text={leftSections[leftIndex]?.title}
                      section={leftSections[leftIndex]?.indexLabel}
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </main>
      </div>
      <div className="w-full gap-2 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xs font-semibold">View Timers</h3>
          <span
            className={`text-xs ${
              isManuallyStarted ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isManuallyStarted ? "(Started)" : "(Not Started)"}
          </span>
        </div>
        <p>Single/Query View Time: {timers.single}s</p>
        <p>Dual View Time: {timers.dual}s</p>
        <p>Full View Time: {timers.full}s</p>
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
  );
}
