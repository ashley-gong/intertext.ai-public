import { textFiles } from "../../../utils/constants";

interface Props {
  results: ResultItem[];
  submittedText: { queryText: string; targetWord: string } | null;
}

export default function AlignedResult(data: Props) {
  const splitByToken = (sentence: string, token: string) => {
    const index = sentence.indexOf(token);
    if (index === -1) return [sentence];
    return [
        sentence.substring(0, index),
        token,
        sentence.substring(index + token.length)
    ];
  };

  const truncateWords = (text: string, count: number, fromStart = true) => {
    const words = text.trim().split(/\s+/);
    return fromStart ? words.slice(-count).join(' ') : words.slice(0, count).join(' ');
  };

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      { data.results.map((item, index) => (
          <div key={index} className="flex flex-row items-center py-2">
            <div className="flex text-xs font-semibold w-1/6">
              {textFiles.find((text) => text.value === item.document)?.label}: {item.section}
            </div>

            <div className="flex flex-row items-center w-5/6">
              <span className="text-right w-1/2 pr-1 text-sm truncate-start">
                {truncateWords(splitByToken(item.sentence, item.token)[0] || '', 10, true)}...
              </span>
              <div className="flex text-left w-1/2 items-center text-sm min-w-0">
                <span className={`${item.tokenHighlight} font-semibold whitespace-nowrap text-left`}>
                  {splitByToken(item.sentence, item.token)[1]}
                </span>
                <span className="text-left pl-1 truncate">
                  {truncateWords(splitByToken(item.sentence, item.token)[2] || '', 10, false)}...
                </span>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}