/* eslint-disable @typescript-eslint/no-unused-vars */
interface Section {
  title: string;
  indexLabel: string;
  content: string;
}

interface ResultItem {
  document: string;
  section: string;
  sentence: string;
  token: string;
  score: number;
  commonLemmas?: string[];
  tokenHighlight?: string | undefined;
}