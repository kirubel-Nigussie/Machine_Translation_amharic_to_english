import tensorflow as tf
import sentencepiece as spm
import numpy as np
from sacrebleu.metrics import BLEU
import pandas as pd
from datetime import datetime
import os

class ModelEvaluator:
    def __init__(self, model_path, tokenizer_amh_path, tokenizer_eng_path):
        """
        Initialize the model evaluator with paths to the saved model and tokenizers
        """
        print("Loading model and tokenizers...")
        self.model = tf.keras.models.load_model(model_path)
        self.sp_amh = spm.SentencePieceProcessor(model_file=tokenizer_amh_path)
        self.sp_eng = spm.SentencePieceProcessor(model_file=tokenizer_eng_path)
        print("Model and tokenizers loaded successfully!")

    def translate_sentence(self, sentence, max_length=50):
        """
        Translate a single sentence from Amharic to English
        """
        # Tokenize and pad the input sentence
        tokens = self.sp_amh.encode_as_ids(sentence)
        tokens = tf.keras.preprocessing.sequence.pad_sequences([tokens], maxlen=max_length, padding='post')
        
        # Initialize decoder input with start token
        target_seq = np.zeros((1, 1))
        target_seq[0, 0] = self.sp_eng.bos_id()
        
        decoded_sentence = []
        for _ in range(max_length):
            # Predict next token
            output_tokens = self.model.predict([tokens, target_seq], verbose=0)
            sampled_token_index = int(np.argmax(output_tokens[0, -1, :]))
            if sampled_token_index == self.sp_eng.eos_id():
                break
            decoded_sentence.append(sampled_token_index)
            # Prepare next decoder input
            target_seq = np.zeros((1, len(decoded_sentence) + 1))
            target_seq[0, :len(decoded_sentence)] = decoded_sentence

        if not decoded_sentence:
            print("Warning: Model returned empty translation for input:", sentence)
            return ""
        # Ensure all elements are int
        decoded_sentence = [int(i) for i in decoded_sentence]
        return self.sp_eng.decode_ids(decoded_sentence)

    def evaluate_bleu(self, test_sentences, reference_translations):
        """
        Calculate BLEU score for a set of test sentences
        """
        print("\nGenerating translations...")
        hypotheses = []
        for sentence in test_sentences:
            translation = self.translate_sentence(sentence)
            hypotheses.append(translation)
        
        # Calculate BLEU score
        bleu = BLEU()
        references = [[ref] for ref in reference_translations]
        bleu_score = bleu.corpus_score(hypotheses, references)
        
        return bleu_score.score, hypotheses

    def analyze_translations(self, test_sentences, reference_translations, hypotheses):
        """
        Analyze translation results and save to a report
        """
        results_dir = "translation_results"
        os.makedirs(results_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results = pd.DataFrame({
            'Amharic': test_sentences,
            'Reference': reference_translations,
            'Translation': hypotheses
        })
        csv_path = os.path.join(results_dir, f'translation_results_{timestamp}.csv')
        results.to_csv(csv_path, index=False)
        report_path = os.path.join(results_dir, f'translation_report_{timestamp}.txt')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("Translation Evaluation Report\n")
            f.write("==========================\n\n")
            for i, (amh, ref, hyp) in enumerate(zip(test_sentences, reference_translations, hypotheses), 1):
                f.write(f"Example {i}:\n")
                f.write(f"Amharic: {amh}\n")
                f.write(f"Reference: {ref}\n")
                f.write(f"Translation: {hyp}\n")
                f.write("-" * 50 + "\n\n")
        return csv_path, report_path

def main():
    
    MODEL_PATH = "models/seq2seq_model.h5"  
    TOKENIZER_AMH_PATH = "models/tokenizer_amh.model"
    TOKENIZER_ENG_PATH = "models/tokenizer_eng.model"

    print("\nCurrent working directory:", os.getcwd())
    print("\nChecking if files exist:")
    print(f"Model path exists: {os.path.exists(MODEL_PATH)}")
    print(f"Amharic tokenizer exists: {os.path.exists(TOKENIZER_AMH_PATH)}")
    print(f"English tokenizer exists: {os.path.exists(TOKENIZER_ENG_PATH)}")

    evaluator = ModelEvaluator(MODEL_PATH, TOKENIZER_AMH_PATH, TOKENIZER_ENG_PATH)

    # Test sentences and their reference translations
    test_sentences = [
        "ሰላም እንደምን አለህ",
        "ዛሬ የትኛው ቀን ነው",
        "እንደምን አለህ",
        "በአዲስ አበባ ውስጥ የሚኖር ነው",
        "እንደምን አለህ ዛሬ"
    ]

    reference_translations = [
        "Hello, how are you?",
        "What day is today?",
        "How are you?",
        "He lives in Addis Ababa",
        "How are you today?"
    ]

    print("\nEvaluating model...")
    bleu_score, hypotheses = evaluator.evaluate_bleu(test_sentences, reference_translations)
    print(f"\nBLEU Score: {bleu_score}")

    print("\nAnalyzing translations...")
    csv_path, report_path = evaluator.analyze_translations(test_sentences, reference_translations, hypotheses)
    print(f"\nResults saved to:")
    print(f"CSV file: {csv_path}")
    print(f"Detailed report: {report_path}")

    print("\nExample Translations:")
    print("====================")
    for i, (amh, ref, hyp) in enumerate(zip(test_sentences, reference_translations, hypotheses), 1):
        print(f"\nExample {i}:")
        print(f"Amharic: {amh}")
        print(f"Reference: {ref}")
        print(f"Translation: {hyp}")
        print("-" * 50)

if __name__ == "__main__":
    main()