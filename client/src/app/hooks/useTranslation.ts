import { useState, useEffect } from "react";
import { translation } from "../../../utils/api";
import { textFiles } from "../../../utils/constants";

interface TranslationData {
  data: string;
  loading: boolean;
}

export const useTranslation = (
  text: string,
  section: string,
  full: boolean = false
): TranslationData => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const urn = textFiles.find((t) => t.label === text)?.translation;
      const dataToSend = {
        urn: urn,
        section: section,
        full: full.toString(),
      };

      if (text) {
        const translationText = await translation(dataToSend);
        if (
          translationText.content ===
          "Unfortunately, no translation available from Scaife Viewer"
        ) {
          const textFile = textFiles.find((t) => t.label === text)?.value;
          const englishFile = textFile?.replace(/\.txt$/, "_ENG.txt");
          const response = await fetch(`/${englishFile}`);
          const fullText = await response.text();
          setData(fullText);
        } else {
          setData(translationText.content);
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [text, section, full]);

  return { data, loading };
};
