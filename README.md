
# Amharic to English Machine Translation

This project implements a neural machine translation system that translates text from Amharic to English using a sequence-to-sequence model with LSTM architecture.

## Project Overview

The translation system uses a deep learning approach with the following components:
- Encoder-Decoder architecture with LSTM layers
- SentencePiece tokenization for both Amharic and English
- Embedding dimension: 128
- LSTM units: 256
- Vocabulary size: 4000 tokens per language

## Dataset

The model is trained on a parallel corpus of Amharic-English sentence pairs. The dataset is loaded in chunks to manage memory efficiently.

amh.txt = 53313 Sentence
eng.txt = 53313 Sentence

## Training Configuration

- Number of epochs: 50 (with early stopping)
- Batch size: 16
- Learning rate: 0.001
- Validation split: 10%
- Early stopping patience: 3 epochs

## Model Performance

The model's performance is evaluated using BLEU score, though it's important to note that the current implementation has room for improvement. The model's limitations include:

1. Limited training data compared to state-of-the-art systems
2. Reduced model size to accommodate available computational resources
3. Basic architecture without attention mechanisms
4. Limited vocabulary size (4000 tokens per language)

## Running the Project

### Backend Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Start the FastAPI backend server:
```bash
uvicorn app:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Translation Endpoint
- URL: `http://localhost:8000/translate`
- Method: GET
- Parameter: `amharic` (string)
- Response: JSON with `translation` field

### Testing with Postman

You can test the API using Postman with the following example:

1. Create a new GET request
2. Set URL to: `http://localhost:8000/translate?amharic=ሰላም`
3. Send the request
4. Expected response:
```json
{
    "translation": "hello"
}
```

### Dummy Test Data

Here are some sample Amharic sentences you can use for testing:

1. ሰላም - Hello
2. እንደምን አለህ - How are you
3. እንኳን ደህና መጡ - Welcome
4. አመሰግናለሁ - Thank you
5. በጣም ደስ ይላል - Very good

## Model Limitations and Future Improvements

The current model has several limitations that affect its translation quality:

1. **Limited Training Data**: The model would benefit from a larger parallel corpus
2. **Architecture**: Adding attention mechanisms would improve translation quality
3. **Vocabulary Size**: Increasing the vocabulary size would help with rare words
4. **Model Size**: A larger model with more parameters could capture more complex patterns
5. **Pre-training**: Incorporating pre-trained language models would improve performance

