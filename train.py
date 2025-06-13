import pandas as pd
import tensorflow as tf
import sentencepiece as spm
from tensorflow.keras.layers import Input, LSTM, Embedding, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import numpy as np
import gc

# Enable memory growth for GPU
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

# Load large dataset in chunks
def load_parallel_corpus(amh_file, eng_file, chunk_size=10000):
    amharic_sentences = []
    english_sentences = []
    
    with open(amh_file, 'r', encoding='utf-8') as f_amh, open(eng_file, 'r', encoding='utf-8') as f_eng:
        while True:
            amh_chunk = [next(f_amh, '').strip() for _ in range(chunk_size)]
            eng_chunk = [next(f_eng, '').strip() for _ in range(chunk_size)]
            
            if not amh_chunk[0] or not eng_chunk[0]:  # End of file
                break
                
            amharic_sentences.extend(amh_chunk)
            english_sentences.extend(eng_chunk)
            
            # Clear memory
            gc.collect()
            
    return amharic_sentences, english_sentences

# Load data
print("Loading data...")
amharic_sentences, english_sentences = load_parallel_corpus("data/amh.txt", "data/eng.txt")

# Train SentencePiece tokenizers (larger vocab)
print("Training tokenizers...")
for lang, sentences in [("amh", amharic_sentences), ("eng", english_sentences)]:
    with open(f"data/{lang}.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(sentences))
    spm.SentencePieceTrainer.train(
        input=f"data/{lang}.txt",
        model_prefix=f"models/tokenizer_{lang}",
        vocab_size=4000,  # Reduced vocabulary size
        model_type="unigram",
        character_coverage=1.0,
        pad_id=0,
        unk_id=1,
        bos_id=2,
        eos_id=3
    )

# Load tokenizers
print("Loading tokenizers...")
sp_amh = spm.SentencePieceProcessor(model_file="models/tokenizer_amh.model")
sp_eng = spm.SentencePieceProcessor(model_file="models/tokenizer_eng.model")

# Tokenize data in chunks
def tokenize_in_chunks(sentences, tokenizer, chunk_size=1000):
    encoded = []
    for i in range(0, len(sentences), chunk_size):
        chunk = sentences[i:i + chunk_size]
        encoded.extend([tokenizer.encode_as_ids(sent) for sent in chunk])
        gc.collect()
    return encoded

print("Tokenizing data...")
amh_encoded = tokenize_in_chunks(amharic_sentences, sp_amh)
eng_encoded = tokenize_in_chunks(english_sentences, sp_eng)

# Clear memory
del amharic_sentences, english_sentences
gc.collect()

# Pad sequences
print("Padding sequences...")
max_len_amh = max(len(x) for x in amh_encoded)
max_len_eng = max(len(x) for x in eng_encoded)
amh_padded = tf.keras.preprocessing.sequence.pad_sequences(amh_encoded, maxlen=max_len_amh, padding="post")
eng_padded = tf.keras.preprocessing.sequence.pad_sequences(eng_encoded, maxlen=max_len_eng, padding="post")

# Clear memory
del amh_encoded, eng_encoded
gc.collect()

# Split data into train and validation
print("Splitting data...")
val_split = 0.1
val_size = int(len(amh_padded) * val_split)
train_amh = amh_padded[:-val_size]
train_eng = eng_padded[:-val_size]
val_amh = amh_padded[-val_size:]
val_eng = eng_padded[-val_size:]

# Clear memory
del amh_padded, eng_padded
gc.collect()

# Reduced model size
embedding_dim = 128  
lstm_units = 256     

print("Building model...")
# Encoder
encoder_inputs = Input(shape=(None,))
encoder_embedding = Embedding(input_dim=4000, output_dim=embedding_dim)(encoder_inputs)
encoder_lstm = LSTM(lstm_units, return_state=True)
_, state_h, state_c = encoder_lstm(encoder_embedding)

# Decoder
decoder_inputs = Input(shape=(None,))
decoder_embedding = Embedding(input_dim=4000, output_dim=embedding_dim)(decoder_inputs)
decoder_lstm = LSTM(lstm_units, return_sequences=True, return_state=True)
decoder_outputs, _, _ = decoder_lstm(decoder_embedding, initial_state=[state_h, state_c])
decoder_dense = Dense(4000, activation="softmax")(decoder_outputs)

# Create model
model = Model([encoder_inputs, decoder_inputs], decoder_dense)

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# Callbacks
callbacks = [
    EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    ),
    ModelCheckpoint(
        "models/seq2seq_model.h5",
        monitor="val_loss",
        save_best_only=True
    )
]

# Train model with smaller batch size
print("Starting training...")
history = model.fit(
    [train_amh, train_eng[:, :-1]],  
    tf.expand_dims(train_eng[:, 1:], -1),  
    validation_data=(
        [val_amh, val_eng[:, :-1]],
        tf.expand_dims(val_eng[:, 1:], -1)
    ),
    batch_size=16,  
    epochs=50,
    callbacks=callbacks,
    verbose=1
)

# Save final model
print("Saving model...")
model.save("models/seq2seq_model_final.h5")

# Save training history
import json
with open("models/training_history.json", "w") as f:
    json.dump(history.history, f)

print("Training completed!")