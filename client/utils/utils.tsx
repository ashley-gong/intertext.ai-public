export const highlightTokenInSentence = (sentence: string, token: string, color: string | undefined) => {
  const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\b${escapedToken}\\b)`, 'gi');
  const parts = sentence.split(regex);   
  return parts.map((part, index) =>
    part.toLowerCase() === token.toLowerCase() ? (
      <span key={index} className={`${color} font-semibold`}>{part}</span>
    ) : (
      part
    )
  );
};

const processStringCompare = (part: string) => {
  const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escapedPart.replace(/\[\d+\]|\d+|\n+|\s+/g, '').toLowerCase();
}

export const highlightSentenceInPassage = (sentence: string, passage: string, token: string, tokenColor: string, boldWords: string[]) => {
  if (sentence === "") {
    return passage;
  } 
  const rawSentence = sentence.replace(/ \/ /g, '\n');
  const escapedSentence = rawSentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSentence})`, 'gi');
  const parts = passage.split(regex);
  return parts.map((part, index) => {
    if (processStringCompare(part) === processStringCompare(rawSentence)) {
      if (token !== "" && boldWords) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(\\b${escapedToken}\\b)`, 'gi');    
        const sentenceParts = part.split(regex);
        const boldWordsRegex = new RegExp(`\\b(${boldWords.join('|')})\\b`, 'gi');

        return (
          <span key={index} className="bg-blue-200">
            {sentenceParts.map((subPart, subIndex) => {
            if (processStringCompare(subPart) === processStringCompare(token)) {
              return (
                <span key={subIndex} className={`${tokenColor} font-medium`}>
                  {subPart}
                </span>
              );
            } else {
              return subPart.split(boldWordsRegex).map((word, wordIndex) =>
                boldWords.includes(word.toLowerCase()) ? (
                  <span key={`${subIndex}-${wordIndex}`} className="text-orange-600 font-medium">{word}</span>
                ) : (
                  word
                )
              );
            }
          })}
          </span>
        );
      } else {
        return <span key={index} className="bg-blue-200">{part}</span>  
      }
    }
    return part;
  });
};

export const escapeText = (text: string | undefined) => text?.toLowerCase().replace(/[-[\]{}()*+?^$|#\\]/g, '');
