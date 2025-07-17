// 🌐 DOM references
const translateButton = document.getElementById("translate-button");
const inputField = document.getElementById("input-text");
const outputContainer = document.getElementById("translation-output");
const outputText = document.getElementById("output-text");
const historyList = document.getElementById("history-list");

// 🌍 Language code-to-name mapping
const languageMap = {
  fr: "French",
  es: "Spanish",
  ja: "Japanese",
};

// 🗝️ OpenAI API Key — dev use only!
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // Replace with your actual key

// 🕓 History Logging Function
function updateHistory(originalText, translatedText, language) {
  if (!originalText || !translatedText) return;

  const li = document.createElement("li");
  li.textContent = `➡️ "${originalText}" → [${language}]: "${translatedText}"`;
  historyList.prepend(li);
}

// 🚀 Translation handler
async function handleTranslate() {
  console.log("Button was clicked");

  const input = inputField.value.trim();
  if (input === "") {
    alert("Please enter text to translate.");
    return;
  }

  const selectedRadio = document.querySelector(
    'input[name="language"]:checked'
  );
  const selectedValue = selectedRadio?.value;
  const targetLanguage = languageMap[selectedValue] || "French";

  const prompt = `Translate the following to ${targetLanguage}: ${input}`;

  // 🔄 UI feedback
  translateButton.disabled = true;
  translateButton.textContent = "Translating...";
  outputContainer.style.display = "none";
  outputText.textContent = "";
  outputText.style.color = "#222";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that translates text to the user's chosen language.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API error");
    }

    const translated = data.choices[0].message.content;

    outputText.textContent = translated;
    outputContainer.style.display = "block";

    // 🕓 Log history
    updateHistory(input, translated, targetLanguage);
  } catch (err) {
    console.error("Translation error:", err);
    outputText.textContent = `⚠️ ${err.message}`;
    outputText.style.color = "#d83b01";
    outputContainer.style.display = "block";
  } finally {
    translateButton.disabled = false;
    translateButton.textContent = "Translate";
  }
}

// 🔗 Wire up after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  translateButton.addEventListener("click", handleTranslate);
});
