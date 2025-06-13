// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App













// // src/App.jsx or src/App.tsx
// import React, { useState } from 'react';
// import './App.css'; // This line expects App.css to be in the same 'src' directory

// function App() {
//     const [amharicInput, setAmharicInput] = useState('ይህ የአማርኛ ግብዓት ጽሑፍ ነው። እዚህ ላይ የሚተረጎም የአማርኛ ጽሑፍ ያስገቡ።');
//     const [englishOutput, setEnglishOutput] = useState('');
//     const [feedbackMessage, setFeedbackMessage] = useState('');
//     const [feedbackType, setFeedbackType] = useState('info'); // 'info', 'success', 'warning', 'error'
//     const [isTranslating, setIsTranslating] = useState(false);

//     // Function to display feedback messages
//     const showFeedback = (message, type = 'info') => {
//         setFeedbackMessage(message);
//         setFeedbackType(type);
//         setTimeout(() => {
//             setFeedbackMessage('');
//             setFeedbackType('info'); // Reset to default
//         }, 3000); // Hide after 3 seconds
//     };

//     // Dummy translate function (would integrate with a real translation API)
//     const translateText = async () => {
//         if (amharicInput.trim() === '') {
//             showFeedback('Please enter Amharic text to translate.', 'warning');
//             return;
//         }

//         setEnglishOutput('Translating...');
//         setIsTranslating(true); // Disable button during translation
//         showFeedback('Translation in progress...');

//         try {
//             // Simulate API call delay
//             await new Promise(resolve => setTimeout(resolve, 1500));

//             // This is where you would call your LLM (e.g., Gemini API) for actual translation
//             // const apiKey = "";
//             // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
//             // const payload = { contents: [{ role: "user", parts: [{ text: `Translate from Amharic to English: ${amharicInput}` }] }] };
//             //
//             // const response = await fetch(apiUrl, {
//             //     method: 'POST',
//             //     headers: { 'Content-Type': 'application/json' },
//             //     body: JSON.stringify(payload)
//             // });
//             // const result = await response.json();
//             //
//             // let translatedText;
//             // if (result.candidates && result.candidates.length > 0 &&
//             //     result.candidates[0].content && result.candidates[0].content.parts &&
//             //     result.candidates[0].content.parts.length > 0) {
//             //     translatedText = result.candidates[0].content.parts[0].text;
//             // } else {
//             //     translatedText = "Translation failed: Unexpected API response.";
//             // }

//             // For demonstration, we'll just provide a dummy translation
//             let translatedText;
//             if (amharicInput.includes("ይህ የአማርኛ ግብዓት ጽሑፍ ነው።")) {
//                 translatedText = "This is Amharic input text. Enter Amharic text to be translated here.";
//             } else if (amharicInput.includes("እንዴት ነህ?")) {
//                 translatedText = "How are you?";
//             } else {
//                 translatedText = `(Dummy Translation for: "${amharicInput}") - This text is a placeholder. A real API would provide an accurate translation.`;
//             }

//             setEnglishOutput(translatedText);
//             showFeedback('Translation complete!', 'success');

//         } catch (error) {
//             console.error('Translation error:', error);
//             setEnglishOutput('Error during translation. Please try again.');
//             showFeedback('Error: Could not translate text.', 'error');
//         } finally {
//             setIsTranslating(false); // Re-enable button
//         }
//     };

//     // Clear function
//     const clearText = () => {
//         setAmharicInput('');
//         setEnglishOutput('');
//         showFeedback('Text fields cleared.', 'info');
//     };

//     // Copy output function
//     const copyOutput = () => {
//         if (englishOutput.trim() === '') {
//             showFeedback('No text to copy in the output box.', 'warning');
//             return;
//         }
//         // Create a temporary textarea element to copy from
//         const tempTextArea = document.createElement('textarea');
//         tempTextArea.value = englishOutput;
//         document.body.appendChild(tempTextArea);
//         tempTextArea.select();
//         tempTextArea.setSelectionRange(0, 99999); // For mobile devices

//         try {
//             document.execCommand('copy'); // Copy the text to clipboard
//             showFeedback('Translated text copied to clipboard!', 'success');
//         } catch (err) {
//             showFeedback('Failed to copy text. Please try manually.', 'error');
//             console.error('Failed to copy text:', err);
//         }
//         document.body.removeChild(tempTextArea); // Remove the temporary element
//         window.getSelection().removeAllRanges(); // Deselect the text
//     };

//     // Determine feedback message background color based on type
//     const getFeedbackClass = () => {
//         switch (feedbackType) {
//             case 'success':
//                 return 'feedback-success';
//             case 'error':
//                 return 'feedback-error';
//             case 'warning':
//                 return 'feedback-warning';
//             default:
//                 return 'feedback-info';
//         }
//     };

//     return (
//         <div className="app-container">
//             <div className="translator-card">
//                 {/* Input Section */}
//                 <div className="translation-section">
//                     <h2 className="section-title">Amharic Input</h2>
//                     <textarea
//                         id="amharicInput"
//                         className="translator-textarea"
//                         placeholder="Enter Amharic text here..."
//                         value={amharicInput}
//                         onChange={(e) => setAmharicInput(e.target.value)}
//                     ></textarea>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="action-buttons">
//                     <button
//                         id="translateBtn"
//                         className="action-button"
//                         onClick={translateText}
//                         disabled={isTranslating}
//                     >
//                         {isTranslating ? 'Translating...' : 'Translate'}
//                     </button>
//                     <button
//                         id="clearBtn"
//                         className="action-button"
//                         onClick={clearText}
//                     >
//                         Clear
//                     </button>
//                     <button
//                         id="copyBtn"
//                         className="action-button"
//                         onClick={copyOutput}
//                     >
//                         Copy Output
//                     </button>
//                 </div>

//                 {/* Output Section */}
//                 <div className="translation-section">
//                     <h2 className="section-title">English Output</h2>
//                     <textarea
//                         id="englishOutput"
//                         className="translator-textarea"
//                         placeholder="Translated English text will appear here."
//                         readOnly
//                         value={englishOutput}
//                     ></textarea>
//                 </div>
//             </div>

//             {/* Feedback Message */}
//             {feedbackMessage && (
//                 <div className={`feedback-message ${getFeedbackClass()}`}>
//                     {feedbackMessage}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;














// // src/App.jsx or src/App.tsx
// import React, { useState } from 'react';
// import './App.css'; // This line requires App.css to be in the same 'src' directory as App.jsx

// function App() {
//     const [amharicInput, setAmharicInput] = useState('ይህ የአማርኛ ግብዓት ጽሑፍ ነው። እዚህ ላይ የሚተረጎም የአማርኛ ጽሑፍ ያስገቡ።');
//     const [englishOutput, setEnglishOutput] = useState('');
//     const [feedbackMessage, setFeedbackMessage] = useState('');
//     const [feedbackType, setFeedbackType] = useState('info'); // 'info', 'success', 'warning', 'error'
//     const [isTranslating, setIsTranslating] = useState(false);

//     // Function to display feedback messages
//     const showFeedback = (message, type = 'info') => {
//         setFeedbackMessage(message);
//         setFeedbackType(type);
//         setTimeout(() => {
//             setFeedbackMessage('');
//             setFeedbackType('info'); // Reset to default
//         }, 3000); // Hide after 3 seconds
//     };

//     // Function to handle translation by interacting with the FastAPI backend
//     const translateText = async () => {
//         const textToTranslate = amharicInput.trim();
//         if (textToTranslate === '') {
//             showFeedback('Please enter Amharic text to translate.', 'warning');
//             return;
//         }

//         setEnglishOutput('Translating...');
//         setIsTranslating(true); // Disable button during translation
//         showFeedback('Translation in progress...');

//         try {
//             // Construct the URL for your FastAPI endpoint
//             // encodeURIComponent ensures that special characters in the Amharic text are properly URL-encoded
//             const apiUrl = `http://localhost:8000/translate?amharic=${encodeURIComponent(textToTranslate)}`;

//             // Make the GET request to your FastAPI backend
//             const response = await fetch(apiUrl, {
//                 method: 'GET', // Specify GET method as per your backend
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // If your backend requires CORS headers, you might need to configure them in FastAPI
//                     // or add 'Access-Control-Allow-Origin' headers on the backend.
//                     // For local development, FastAPI often handles basic CORS automatically.
//                 },
//             });

//             // Check if the response was successful (status code 200-299)
//             if (!response.ok) {
//                 // If the response is not OK, throw an error with the status
//                 const errorData = await response.json(); // Try to parse error response if any
//                 throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorData.detail || 'Unknown error'}`);
//             }

//             // Parse the JSON response from the backend
//             const data = await response.json();

//             // Extract the translation from the response
//             const translatedText = data.translation;

//             if (translatedText) {
//                 setEnglishOutput(translatedText);
//                 showFeedback('Translation complete!', 'success');
//             } else {
//                 setEnglishOutput('No translation received.');
//                 showFeedback('Translation failed: Empty response.', 'error');
//             }

//         } catch (error) {
//             console.error('Translation error:', error);
//             setEnglishOutput('Error during translation. Please try again. Check backend server and network.');
//             showFeedback(`Error: ${error.message}`, 'error');
//         } finally {
//             setIsTranslating(false); // Re-enable button regardless of success or failure
//         }
//     };

//     // Clear function
//     const clearText = () => {
//         setAmharicInput('');
//         setEnglishOutput('');
//         showFeedback('Text fields cleared.', 'info');
//     };

//     // Copy output function
//     const copyOutput = () => {
//         if (englishOutput.trim() === '') {
//             showFeedback('No text to copy in the output box.', 'warning');
//             return;
//         }
//         // Create a temporary textarea element to copy from
//         const tempTextArea = document.createElement('textarea');
//         tempTextArea.value = englishOutput;
//         document.body.appendChild(tempTextArea);
//         tempTextArea.select();
//         tempTextArea.setSelectionRange(0, 99999); // For mobile devices

//         try {
//             document.execCommand('copy'); // Copy the text to clipboard
//             showFeedback('Translated text copied to clipboard!', 'success');
//         } catch (err) {
//             showFeedback('Failed to copy text. Please try manually.', 'error');
//             console.error('Failed to copy text:', err);
//         }
//         document.body.removeChild(tempTextArea); // Remove the temporary element
//         window.getSelection().removeAllRanges(); // Deselect the text
//     };

//     // Determine feedback message background color based on type
//     const getFeedbackClass = () => {
//         switch (feedbackType) {
//             case 'success':
//                 return 'feedback-success';
//             case 'error':
//                 return 'feedback-error';
//             case 'warning':
//                 return 'feedback-warning';
//             default:
//                 return 'feedback-info';
//         }
//     };

//     return (
//         <div className="app-container">
//             <div className="translator-card">
//                 {/* Input Section */}
//                 <div className="translation-section">
//                     <h2 className="section-title">Amharic Input</h2>
//                     <textarea
//                         id="amharicInput"
//                         className="translator-textarea"
//                         placeholder="Enter Amharic text here..."
//                         value={amharicInput}
//                         onChange={(e) => setAmharicInput(e.target.value)}
//                     ></textarea>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="action-buttons">
//                     <button
//                         id="translateBtn"
//                         className="action-button"
//                         onClick={translateText}
//                         disabled={isTranslating}
//                     >
//                         {isTranslating ? 'Translating...' : 'Translate'}
//                     </button>
//                     <button
//                         id="clearBtn"
//                         className="action-button"
//                         onClick={clearText}
//                     >
//                         Clear
//                     </button>
//                     <button
//                         id="copyBtn"
//                         className="action-button"
//                         onClick={copyOutput}
//                     >
//                         Copy Output
//                     </button>
//                 </div>

//                 {/* Output Section */}
//                 <div className="translation-section">
//                     <h2 className="section-title">English Output</h2>
//                     <textarea
//                         id="englishOutput"
//                         className="translator-textarea"
//                         placeholder="Translated English text will appear here."
//                         readOnly
//                         value={englishOutput}
//                     ></textarea>
//                 </div>
//             </div>

//             {/* Feedback Message */}
//             {feedbackMessage && (
//                 <div className={`feedback-message ${getFeedbackClass()}`}>
//                     {feedbackMessage}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;













// src/App.jsx or src/App.tsx
import React, { useState } from 'react';
import './App.css'; // This line requires App.css to be in the same 'src' directory as App.jsx

function App() {
    const [amharicInput, setAmharicInput] = useState('ይህ የአማርኛ ግብዓት ጽሑፍ ነው። እዚህ ላይ የሚተረጎም የአማርኛ ጽሑፍ ያስገቡ።');
    const [englishOutput, setEnglishOutput] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('info'); // 'info', 'success', 'warning', 'error'
    const [isTranslating, setIsTranslating] = useState(false);

    // Function to display feedback messages
    const showFeedback = (message, type = 'info') => {
        setFeedbackMessage(message);
        setFeedbackType(type);
        setTimeout(() => {
            setFeedbackMessage('');
            setFeedbackType('info'); // Reset to default
        }, 3000); // Hide after 3 seconds
    };

    // Function to handle translation by interacting with the FastAPI backend
    const translateText = async () => {
        const textToTranslate = amharicInput.trim();
        if (textToTranslate === '') {
            showFeedback('Please enter Amharic text to translate.', 'warning');
            return;
        }

        setEnglishOutput('Translating...');
        setIsTranslating(true); // Disable button during translation
        showFeedback('Translation in progress...');

        try {
            // Construct the URL for your FastAPI endpoint
            // encodeURIComponent ensures that special characters in the Amharic text are properly URL-encoded
            const apiUrl = `http://localhost:8000/translate?amharic=${encodeURIComponent(textToTranslate)}`;

            // Make the GET request to your FastAPI backend
            const response = await fetch(apiUrl, {
                method: 'GET', // Specify GET method as per your backend
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response was successful (status code 200-299)
            if (!response.ok) {
                // If the response is not OK, throw an error with the status
                const errorData = await response.json(); // Try to parse error response if any
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorData.detail || 'Unknown error'}`);
            }

            // Parse the JSON response from the backend
            const data = await response.json();

            // Extract the translation from the response
            const translatedText = data.translation;

            if (translatedText) {
                setEnglishOutput(translatedText);
                showFeedback('Translation complete!', 'success');
            } else {
                setEnglishOutput('No translation received.');
                showFeedback('Translation failed: Empty response.', 'error');
            }

        } catch (error) {
            console.error('Translation error:', error);
            // Provide a more informative error message for the user
            setEnglishOutput('Error during translation. This might be a CORS issue. Please check your backend server\'s CORS configuration.');
            showFeedback(`Error: ${error.message}. Check browser console for details.`, 'error');
        } finally {
            setIsTranslating(false); // Re-enable button regardless of success or failure
        }
    };

    // Clear function
    const clearText = () => {
        setAmharicInput('');
        setEnglishOutput('');
        showFeedback('Text fields cleared.', 'info');
    };

    // Copy output function
    const copyOutput = () => {
        if (englishOutput.trim() === '') {
            showFeedback('No text to copy in the output box.', 'warning');
            return;
        }
        // Create a temporary textarea element to copy from
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = englishOutput;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy'); // Copy the text to clipboard
            showFeedback('Translated text copied to clipboard!', 'success');
        } catch (err) {
            showFeedback('Failed to copy text. Please try manually.', 'error');
            console.error('Failed to copy text:', err);
        }
        document.body.removeChild(tempTextArea); // Remove the temporary element
        window.getSelection().removeAllRanges(); // Deselect the text
    };

    // Determine feedback message background color based on type
    const getFeedbackClass = () => {
        switch (feedbackType) {
            case 'success':
                return 'feedback-success';
            case 'error':
                return 'feedback-error';
            case 'warning':
                return 'feedback-warning';
            default:
                return 'feedback-info';
        }
    };

    return (
        <div className="app-container">
            <div className="translator-card">
                {/* Input Section */}
                <div className="translation-section">
                    <h2 className="section-title">Amharic Input</h2>
                    <textarea
                        id="amharicInput"
                        className="translator-textarea"
                        placeholder="Enter Amharic text here..."
                        value={amharicInput}
                        onChange={(e) => setAmharicInput(e.target.value)}
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        id="translateBtn"
                        className="action-button"
                        onClick={translateText}
                        disabled={isTranslating}
                    >
                        {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                    <button
                        id="clearBtn"
                        className="action-button"
                        onClick={clearText}
                    >
                        Clear
                    </button>
                    <button
                        id="copyBtn"
                        className="action-button"
                        onClick={copyOutput}
                    >
                        Copy Output
                    </button>
                </div>

                {/* Output Section */}
                <div className="translation-section">
                    <h2 className="section-title">English Output</h2>
                    <textarea
                        id="englishOutput"
                        className="translator-textarea"
                        placeholder="Translated English text will appear here."
                        readOnly
                        value={englishOutput}
                    ></textarea>
                </div>
            </div>

            {/* Feedback Message */}
            {feedbackMessage && (
                <div className={`feedback-message ${getFeedbackClass()}`}>
                    {feedbackMessage}
                </div>
            )}
        </div>
    );
}

export default App;
