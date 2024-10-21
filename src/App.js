import React, { useState } from 'react';
import './App.css';

function App() {
  const [openApiKey, setOpenApiKey] = useState('');
  const [keywords, setKeywords] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false)

  const copyNewText = async () => {
    const responseText = aiResponse;
    navigator.clipboard.writeText(responseText);
  };

  const handleOpenApiKeyChange = (event) => {
    setOpenApiKey(event.target.value);
  };

  const handleKeywordsChange = (event) => {
    setKeywords(event.target.value);
  };

  const handleGenerateResponse = async () => {
    if (typing)
      return;
    setAiResponse('');
  setError(null);
    if (!openApiKey || !keywords) {
      alert('Please enter both the OpenAPI key and the keywords.');
      return;
    }
  
    try {
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openApiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Find obscure clothing brands with a similar style to ${keywords}` },
          ],
          max_tokens: 750,
          temperature: 0.5,
          model: 'gpt-3.5-turbo-16k',
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error generating response: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        setError('Error generating response: No valid response from API');
        return;
      }
      const aiResponseText = data.choices[0].message.content;
      setTyping(true);

      let responseIndex = 0;
      const intervalId = setInterval(() => {
        const nextChar = aiResponseText[responseIndex];
        setAiResponse((prevResponse) => prevResponse + nextChar);
        responseIndex++;

        if (responseIndex >= aiResponseText.length) {
          clearInterval(intervalId);
          setTyping(false);
        }
      }, 30);

    } catch (error) {
      setError(`Error generating response: ${error.message}`);
    }
  };

  return (
    <div className="App">
            <div className="website-logo">
      <img src="https://i.imgur.com/byLADfT.png" alt="" />
    </div>
    <div className="github-link">
      <img src="https://th.bing.com/th/id/R.3462037553fabf0f6e7bf0fe9ab11515?rik=0Ubh3aP6JzCPcw&riu=http%3a%2f%2fpngimg.com%2fuploads%2fgithub%2fgithub_PNG40.png&ehk=vDH1g6b2G5qphfQR7RsUJ7HmqSSwIMycien%2fvBj03ZU%3d&risl=&pid=ImgRaw&r=0" alt=""/>
    </div>
      <h1>Fashionboy</h1>
      <h2>
  A new way to build your style
  <span style={{ color: 'black', animation: 'blink 1s infinite' }}>&#124;</span>
</h2>
      <h3>Find clothing brands based on </h3>
      <h4>your interests</h4>
      <h5>Type in your favorite aesthetics, trends, or general vibes, 
        then sit back and let artificial intelligence do the brainstorming </h5>
      <form>
        <label for="openapi-key"></label>
        <input type="text" id="openapi-key" name="openapi-key" required placeholder="Enter your OpenAPI key.. (only saved to browser)" value={openApiKey} onChange={handleOpenApiKeyChange} />
        <span class="validity"></span>
      </form>
      <h8>
        <a href="https://www.bing.com/ck/a?!&&p=86ec80d0ea4e7e10JmltdHM9MTcyMTQzMzYwMCZpZ3VpZD0zYzQ4NTQ0Zi0xYWY0LTYzZTYtMzBhMC01ODQwMWJlMDYyNDUmaW5zaWQ9NTIwNQ&ptn=3&ver=2&hsh=3&fclid=3c48544f-1af4-63e6-30a0-58401be06245&psq=openAI+login&u=a1aHR0cHM6Ly9wbGF0Zm9ybS5vcGVuYWkuY29tL2xvZ2luLw&ntb=1">Wondering how you could get an OpenAI API key?</a>
       </h8>
      <form>
       <label for="paragraph"></label>
       <textarea id="paragraph" name="paragraph" required placeholder="Enter clothing styles, aesthetics, or vibes..." value={keywords} onChange={handleKeywordsChange}></textarea>
       <span class="validity"></span>
      </form>
      <button id="generate-button" onClick={handleGenerateResponse}>Generate Response</button>
      <h6>Note: You cannot execute a new prompt until the previous response has finished.</h6>
      <p className="results-heading">Results</p>
      <div className="ai-response">
        {error? (
          <p style={{ color: 'ed' }}>{error}</p>
        ) : (
          <p>
            <span
              dangerouslySetInnerHTML={{
                __html: aiResponse,
              }}
            />
            {typing? <span>|</span> : null}
          </p>
        )}
        </div>
        <button id="copy-text" onClick={copyNewText}>❐</button>
      <h9>by Mazin</h9>
    </div>
  );
}

export default App;