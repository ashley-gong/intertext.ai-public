from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import linalg as LA
from scripts.gen_berts import LatinBERT
import json
import requests
import os
from pinecone import Pinecone
import stanza

# app instance
app = Flask(__name__)
CORS(app)

# with open(f"/etc/config_server.json") as config_file:
#     config = json.load(config_file)

pinecone_api_key = os.getenv("PINECONE_API_KEY") # config["PINECONE_API_KEY"]
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("ai-latin-close-reading")

tokenizer_path = 'models/subword_tokenizer_latin/latin.subword.encoder'
bert_path = 'ashleygong03/bamman-burns-latin-bert'
bert = LatinBERT(tokenizerPath=tokenizer_path, bertPath=bert_path)
# stanza.download('la')
latin_nlp = stanza.Pipeline('la', processors='tokenize,lemma,pos,depparse', verbose=False, use_gpu=False)

@app.route("/api/home", methods=['GET'])
def return_home():
  return jsonify({
    'message': "Hello world!"
  })

def get_target_embedding(sentence, target_word):
  bert_sents = bert.get_berts([sentence])[0]
  for tok, embedding in bert_sents:
    if tok == target_word:
      return embedding / LA.norm(embedding)
  return None

@app.route('/api/query', methods=['POST'])
def query_similarity():
  data = request.json
  query_text = data.get("queryText")
  target_word = data.get("targetWord")
  num_results = int(data.get("numberResults")) if data.get("numberResults") != "" else 5
  target_texts = data.get("targetTexts")

  target_embedding = None
  bert_sents = bert.get_berts([query_text])[0]
  for tok, embedding in bert_sents:
    if tok == target_word:
      target_embedding = embedding / LA.norm(embedding)
      break

  if target_embedding is None:
    return jsonify({"error": "Target word not found in the sentence."}), 400

  target_embedding = target_embedding.tolist()
  
  if num_results > 30:
    num_results = 30

  if len(target_texts) > 0 and target_texts != ['']:  
    results = index.query(
      vector=target_embedding, 
      top_k=100, 
      include_metadata=True, 
      filter={
        "document": {"$in": target_texts},
        "token": {
          "$nin": ["[CLS]", "[SEP]", ",", ".", ":", ";", "-"], 
        },
        "token": {
          "$nin": [str(i) for i in range(1000)], 
        },
      }
    )
  else:
    results = index.query(
      vector=target_embedding, 
      top_k=100, 
      include_metadata=True,
      filter={
        "token": {
          "$nin": ["[CLS]", "[SEP]", ",", ".", ":", ";", "-"], 
        },
        "token": {
          "$nin": [str(i) for i in range(1000)], 
        },
      }
    )
  output = []
  tophundred = []
  for i, match in enumerate(results['matches']):    
    if i >= 100:  
      break
    if i < num_results:
      output.append({
        "score": match['score'], 
        "token": match['metadata']['token'], 
        "document": match['metadata']['document'],
        "sentence": match['metadata']['sentence'],
        "section": match['metadata']['section']
      })
    tophundred.append(match['score'])

  return {"output": output, "tophundred": tophundred}

@app.route('/api/translation', methods=['POST'])
def get_translation():
  data = request.json
  urn = data.get("urn")
  full = data.get("full")
  section = data.get("section") 
  # hard-code Eclogues - redundant but more readable
  if urn[:45] == "urn:cts:latinLit:phi0690.phi001.perseus-eng2:":
    section = ""
  if full == "true":
    section = ""
    # hard-code Catullus and Sallust
    if urn == "urn:cts:latinLit:phi0472.phi001.perseus-eng4:":
      section = "1-116"
    elif urn == "urn:cts:latinLit:phi0631.phi001.perseus-eng2:":
      section = "1-61"
  else:
    if not urn.endswith(":"):
      section = f".{section}"
  url = f'https://scaife.perseus.org/library/passage/{urn}{section}/text/'
  try:
    response = requests.get(url)
    if response.status_code != 200:
      return jsonify({
        "status": "success",
        "content": "Unfortunately, no translation available from Scaife Viewer"
      })
    return jsonify({
      "status": "success",
      "content": response.text
    })
  except requests.exceptions.RequestException as e:
    return jsonify({
        "status": "error",
        "message": str(e)
    }), 500

# input: two sentences, query and result, output: return list of lemmas in result in common with query
@app.route('/api/lemmatize', methods=['POST'])
def lemmatize():
  data = request.json
  sentence1, sentence2 = data['query'], data['result']
  doc1, doc2 = latin_nlp(sentence1), latin_nlp(sentence2)

  lemmas = {word.lemma for sent in doc1.sentences for word in sent.words}
  wordList = [word.text for sent in doc2.sentences for word in sent.words if word.lemma in lemmas]
  
  return {"output": wordList}


if __name__ == "__main__":
  app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 8000)))
