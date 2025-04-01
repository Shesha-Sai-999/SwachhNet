/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Allow requests from any origin
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
  "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
};

// Handle CORS Preflight Requests
async function handleCors(request) {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}


const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    return handleCors(request); // Handle CORS preflight requests
  }

  if (request.method === "GET" && url.pathname === "/") {
    return new Response("✅ Server is running!", { status: 200 });
  }

  if (request.method === "GET" && url.pathname === "/chatbot") {
    return new Response("Chatbot is active! Send a POST request to /api/chat with a 'userMessage' for a response.", { status: 200 });
  }

  if (request.method === "POST" && url.pathname === "/api/chat") {
    return handleChatRequest(request);
  }

  if (request.method === "POST" && url.pathname === "/api/analyze-image") {
    return handleImageAnalysis(request);
  }

  return new Response("Not Found", { status: 404 });
}

async function handleChatRequest(request) {
  try {
    const { userMessage } = await request.json();
    if (!userMessage || typeof userMessage !== "string") {
      return new Response(JSON.stringify({ error: "Invalid input: userMessage must be a string" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const payload = {
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { temperature: 0.9, topP: 0.95, topK: 40 },
    };

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      return new Response(JSON.stringify({ error: data.error?.message || "Gemini API error", details: data }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return new Response(JSON.stringify({ response: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}

async function handleImageAnalysis(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      console.error("No image uploaded. FormData received:", [...formData.entries()]);
      return new Response(JSON.stringify({ error: "No image uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    function bufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    const base64Image = bufferToBase64(arrayBuffer);

    console.log("Image MIME Type:", imageFile.type);
    console.log("Base64 Image Data:", base64Image.substring(0, 50), "..."); // Limit output length

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this image for waste types and approximate quantity." },
            { inline_data: { mime_type: imageFile.type, data: base64Image } },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data);
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gemini API error", details: data }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No description available";
    return new Response(JSON.stringify({ description: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

  } catch (error) {
    console.error("Image Analysis Error:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  }
}
