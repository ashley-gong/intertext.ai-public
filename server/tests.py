from server import latin_nlp

def test_lemmatize(sentence1, sentence2):
  doc1, doc2 = latin_nlp(sentence1), latin_nlp(sentence2)

  lemmas = {word.lemma for sent in doc1.sentences for word in sent.words}
  print(lemmas)
  print([word.lemma for sent in doc2.sentences for word in sent.words])
  wordList = [word.text for sent in doc2.sentences for word in sent.words if word.lemma in lemmas]
  print(wordList)
  
  return {"output": wordList}

if __name__ == "__main__":
    print(test_lemmatize("gallia est omnis divisa in partes tres", "pagos divisa est."))
