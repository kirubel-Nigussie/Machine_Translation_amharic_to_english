import tensorflow as tf
import sentencepiece as spm
import numpy as np

# Load the trained model
model = tf.keras.models.load_model("models/seq2seq_model_final.h5")

# Load tokenizers
sp_amh = spm.SentencePieceProcessor(model_file="models/tokenizer_amh.model")
sp_eng = spm.SentencePieceProcessor(model_file="models/tokenizer_eng.model")

def translate(amharic_text, max_length=50):
    # Tokenize input
    amh_tokens = sp_amh.encode_as_ids(amharic_text)
    
    # Pad sequence
    amh_padded = tf.keras.preprocessing.sequence.pad_sequences(
        [amh_tokens], 
        maxlen=len(amh_tokens), 
        padding="post"
    )
    
    # Initialize decoder input with start token
    decoder_input = np.array([[2]])  # 2 is the start token (BOS)
    
    # Generate translation
    translated_tokens = []
    for _ in range(max_length):
        # Get model prediction
        output = model.predict([amh_padded, decoder_input], verbose=0)
        
        # Get the predicted token
        predicted_token = int(np.argmax(output[0, -1, :]))
        
        # Break if end token is predicted
        if predicted_token == 3:  # 3 is the end token (EOS)
            break
            
        # Add predicted token to output
        translated_tokens.append(predicted_token)
        
        # Update decoder input
        decoder_input = np.append(decoder_input, [[predicted_token]], axis=1)
    
    # Convert tokens to text
    try:
        english_text = sp_eng.decode(translated_tokens)
    except:
        # Fallback to decode_ids if decode fails
        english_text = sp_eng.decode_ids(translated_tokens)
    
    return english_text

def batch_translate(amharic_texts, batch_size=32):
    """Translate multiple sentences in batches for better performance"""
    translations = []
    for i in range(0, len(amharic_texts), batch_size):
        batch = amharic_texts[i:i + batch_size]
        batch_translations = [translate(text) for text in batch]
        translations.extend(batch_translations)
    return translations

# Test the translation
test_sentences = [
    "ጤና ይስጥልኝ",
    "ሰላም",
    "እንዴት ነህ?",
    "ዛሬ እንዴት አለህ?",
    "እንኳን ደህና መጡ",
    "በጣም ደስ ይላል",
    "እናንተ እንዴት አላችሁ?",
    "እኔ ደህና ነኝ",
    "እናንተ ደህና ናችሁ?",
    "እናንተ እንዴት አላችሁ?"
]

print("Testing translations:")
print("-" * 60)
for amh in test_sentences:
    eng = translate(amh)
    print(f"Amharic: {amh}")
    print(f"English: {eng}")
    print("-" * 60)