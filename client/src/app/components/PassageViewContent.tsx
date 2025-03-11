"use client"

import { useState, useEffect, Key } from "react";
import PassageView from "./PassageView";
import PassageSidebar from "./PassageSidebar";
import { textFiles } from '../../../utils/constants';
import { useTextSectionContext } from "../contexts/TextSectionContext";
import { Tab, Tabs } from "@heroui/react";
import FullPassageView from "./FullPassageView";
import FullTranslationView from "./FullTranslationView";

interface Props {
  querySent: boolean;
  querySentence: string;
  queryWord: string;
  children?: React.ReactNode;
}

export default function PassageViewContent({ querySent, querySentence, queryWord, children } : Props) {
  const [selectedView, setSelectedView] = useState<Key>("single");
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true);
  const [timers, setTimers] = useState({ "single": 0, "dual": 0, "full": 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const handleTabChange = (tab : Key) => {
    if (isTimerRunning) {
      if (intervalId) clearInterval(intervalId); 
      setSelectedView(tab);
      const activeTab = tab.toString();
      const id = setInterval(() => {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [activeTab]: prevTimers[activeTab as "single" | "dual" | "full"] + 1
        }));
      }, 1000);
      setIntervalId(id as unknown as number);
    }
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      clearInterval(intervalId as number);
      setIntervalId(null);
    } else {
      const tab = selectedView.toString();
      const id = setInterval(() => {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [tab]: prevTimers[tab as "single" | "dual" | "full"] + 1,
        }));
      }, 1000);
      setIntervalId(id as unknown as number);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setIsTimerRunning(false);
    setTimers({ "single": 0, "dual": 0, "full": 0 });
  }

  const handleMouseLeave = () => {
    if (isTimerRunning) {
      clearInterval(intervalId as number);
      setIntervalId(null);
      setIsTimerRunning(false);
    }
  }

  const handleMouseEnter = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      const tab = selectedView.toString();
      const id = setInterval(() => {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [tab]: prevTimers[tab as "single" | "dual" | "full"] + 1,
        }));
      }, 1000);
      setIntervalId(id as unknown as number);
    }
  }

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

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
  }

  const sidebar = () => {
    switch (selectedView) {
      case "single":
        return (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={leftText.value}
            onTextChange={(value: string, label: string) => { setLeftText({ value, label }); setLeftIndex(0)}}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title=""
            onToggleSidebar={toggleSidebar}
          />
        )
      case "dual":
        return (!isLeftSidebarVisible ? ( 
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={rightText.value}
            onTextChange={(value: string, label: string) => { setRightText({ value, label }); setRightIndex(0)}}
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
            onTextChange={(value: string, label: string) => { setLeftText({ value, label }); setLeftIndex(0)}}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title="(Left)"
            onToggleSidebar={toggleSidebar}
          />     
        )
      )
      case "full":
        return (
          <PassageSidebar
            view={selectedView}
            textFiles={textFiles}
            selectedText={leftText.value}
            onTextChange={(value: string, label: string) => { setLeftText({ value, label }); setLeftIndex(0)}}
            sections={leftSections}
            selectedIndex={leftIndex}
            onSelectIndex={setLeftIndex}
            title=""
            onToggleSidebar={toggleSidebar}
          />
        )
    }
  }

  return (
    <div>
      <div className="flex min-h-screen" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {sidebar()}
        <main className="flex flex-col items-center space-y-4 w-5/6">
          <div className="flex flex-col w-full gap-2">
            <Tabs aria-label="Options" variant="underlined" size="lg" onSelectionChange={handleTabChange}>
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
                  {querySent &&
                    <div className="flex-1">
                      {children}
                    </div>
                  }
                </div>
              </Tab>
              <Tab key="dual" title="Dual Text View">
                <div className="flex flex-col items-center">
                  <button onClick={swapTexts} className="text-xs hover:text-blue-500 pb-2">
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
        <p>Single/Query View Time: {timers.single}s</p>
        <p>Dual View Time: {timers.dual}s</p>
        <p>Full View Time: {timers.full}s</p>
        <button onClick={toggleTimer} className="pr-2 hover:text-blue-500">
          {isTimerRunning ? "Stop Timer" : "Start Timer"}
        </button>
        <button onClick={resetTimer} className="hover:text-blue-500">
          Reset Timer
        </button>
      </div>
    </div>
  );
}