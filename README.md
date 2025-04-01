SwachhNet
=========

Hey there! Welcome to SwachhNet, a web app I’ve built to make waste management smarter and more rewarding. Whether you’re hunting for a nearby dustbin, reporting a pile of trash with a quick photo, or earning points for keeping things clean, SwachhNet has you covered. It’s all about connecting citizens and municipalities to create cleaner, healthier cities—one dustbin at a time.

In this README, I’ll explain what SwachhNet is, why I made it, and how you can get it running on your own machine with simple steps. The backend runs on Cloudflare Workers (in the swachhnet-wrangler/ folder), and the frontend is hosted as static files on Firebase (in the swachhnet-firebase/ folder). Let’s get started!

What is SwachhNet?

SwachhNet is a web application designed to tackle waste management challenges. Need to find the nearest dustbin? Want to report litter that’s been ignored? SwachhNet makes it easy with an interactive map, a simple reporting tool, and a rewards system to keep you motivated. It bridges the gap between everyday people and municipalities, working together for cleaner cities.

Why I Built This
----------------

I created SwachhNet because I was tired of seeing overflowing dustbins and scattered litter. Unmanaged waste isn’t just ugly—it’s a health hazard, pollutes our environment, and hurts a city’s vibe. Finding a dustbin or getting trash picked up shouldn’t be a struggle, so I built this app to use tech to fix that. SwachhNet turns frustration into action, making waste management accessible and rewarding for everyone.

Goals of the Project
--------------------

Here’s what SwachhNet aims to achieve:

*   **Connect People to Dustbins**: Show nearby dustbins with real-time status (full or available).
    
*   **Simplify Waste Reporting**: Let users report waste quickly so municipalities can respond.
    
*   **Encourage Good Habits**: Reward responsible waste disposal and community cleanup efforts.
    
*   **Cleaner Cities**: Reduce litter, boost public health, and make our streets shine.
    

Features
--------

SwachhNet packs some handy tools:

*   **Find Nearby Dustbins**: A map with green dots for available dustbins and red for full ones.
    
*   **Report Waste**: Snap a photo, add details, and send it to the authorities.
    
*   **Earn Rewards**: Collect points for using dustbins or reporting waste, redeemable for eco-friendly items.
    
*   **Track Your Impact**: See how your actions contribute to a cleaner community.
    

Getting Started
---------------

Ready to run SwachhNet yourself? The project has two parts: a backend (Cloudflare Worker) and a frontend (Firebase Hosting). Follow these steps to set it up after cloning the repo.

### Prerequisites

Before you begin, ensure you have:

*   **Node.js** (v14 or higher) and **npm** - Install from [nodejs.org](https://nodejs.org).
    
*   **Git** - Get it from [git-scm.com](https://git-scm.com).
    
*   A **Cloudflare account** - Sign up at [cloudflare.com](https://cloudflare.com).
    
*   A **Firebase account** - Sign up at [firebase.google.com](https://firebase.google.com).
    
*   API keys for:
    
    *   **Google Maps** (for the frontend map) - Get one from [Google Cloud Console](https://console.cloud.google.com).
        
    *   **Gemini AI** (for backend chatbot and image analysis) - Obtain from your provider.
        

Install the necessary CLIs globally:

npm install -g @cloudflare/wrangler
npm install -g firebase-tools

Log in to both services:

```bash
wrangler login
firebase login
```
### Backend Setup (Cloudflare Worker)

The backend lives in the backend/ folder and runs on Cloudflare Workers.

1.  **Clone the repository:**bashCollapseWrapCopygit clone https://github.com/yourusername/swachhnet.gitcd swachhnet
    
2.  **Navigate to the backend folder:**bashCollapseWrapCopycd backend
    
3.  **Install dependencies:**bashCollapseWrapCopynpm install
    
4.  **Set up environment variables:**
    
    *   Edit wrangler.toml to include your Gemini API key:tomlCollapseWrapCopyname = "swachhnet-backend"compatibility\_date = "2023-10-01"\[vars\]GEMINI\_API\_KEY = "your\_gemini\_api\_key\_here"
        
    *   Replace "your\_gemini\_api\_key\_here" with your actual Gemini API key.
        
5.  **Test the worker locally:**bashCollapseWrapCopywrangler dev
    
    *   Open http://localhost:8787 in your browser. You should see "✅ Server is running!" for GET requests to /.
        
    *   Test endpoints like /api/chat (POST with { "userMessage": "Hello" }) or /api/analyze-image (POST with an image file).
        
6.  **Deploy to Cloudflare:**bashCollapseWrapCopywrangler deploy
    
    *   After deployment, you’ll get a URL (e.g., https://swachhnet-backend.yourusername.workers.dev). Save this—you’ll need it for the frontend.
        

### Frontend Setup (Firebase Hosting)

The frontend is in the frontend/ folder and consists of static files hosted on Firebase.

1.  **Navigate to the frontend folder:**bashCollapseWrapCopycd ../frontend _\# From the backend folder, go back and into frontend_
    
2.  **Install dependencies:**bashCollapseWrapCopynpm install
    
3.  **Update the API base URL:**
    
    *   Open src/config.js (or your API config file) and set the backend URL:javascriptCollapseWrapCopyexport const API\_BASE\_URL = 'https://swachhnet-backend.yourusername.workers.dev';
        
    *   Replace with your actual Cloudflare Worker URL from the backend deployment.
        
4.  **Update Google Maps API key:**
    
    *   In public/index.html, find the Google Maps script and add your key:htmlCollapseWrapCopy
        
    *   Replace YOUR\_GOOGLE\_MAPS\_API\_KEY with your actual key.
        
5.  **Build the static files:**bashCollapseWrapCopynpm run build
    
    *   This generates files in a build/ folder (or similar, depending on your setup).
        
6.  **Initialize Firebase (if not already done):**bashCollapseWrapCopyfirebase init
    
    *   Select "Hosting" when prompted.
        
    *   Choose your Firebase project (create one if needed).
        
    *   Set the public directory to build (or your build output folder).
        
7.  **Deploy to Firebase:**bashCollapseWrapCopyfirebase deploy
    
    *   You’ll get a hosting URL (e.g., https://your-project.firebaseapp.com). This is where your frontend lives.
        

### Running the Project

*   **Backend Locally:** Run wrangler dev in the swachhnet-wrangler/ folder for testing.
    
*   **Frontend Locally:** Use npm run serve in the swachhnet-firebase/ folder (if you have a serve script), or test the deployed version at your Firebase URL.
    
*   **Full App:** Deploy both parts and access the frontend URL, which will call the backend endpoints.
    

How to Use It
-------------

With SwachhNet running:

*   **Find Dustbins:** Click “Find Dustbins” in the nav bar. The map shows green (available) and red (full) markers. Click one for directions.
    
*   **Report Waste:** Go to “Report Waste,” add a location, waste type, description, and photo (optional), then submit.
    
*   **Earn Rewards:** Visit “Rewards” to see your points and redeem them for eco-friendly items.
    
*   **Track Progress:** Check “Track Progress” for stats on your contributions.
    

MVP in Action
-------------

Here’s what SwachhNet looks like in action (add screenshots to an images/ folder in your repo):

*   **Homepage:** A banner says “Join the SwachhNet Revolution!” with buttons for key actions.markdownCollapseWrapCopy!\[Homepage\](images/homepage.png)
    
*   **Dustbin Map:** Green and red dots on a Google Map, centered on your location.markdownCollapseWrapCopy!\[Dustbin Map\](images/map.png)
    
*   **Waste Report Form:** A form with fields and an AI description button.markdownCollapseWrapCopy!\[Report Waste\](images/report.png)
    
*   **Rewards Page:** A grid of rewards with your points displayed.markdownCollapseWrapCopy!\[Rewards\](images/rewards.png)
    

Contributing
------------

Want to improve SwachhNet? Here’s how:

1.  Fork the repo on GitHub.
    
2.  Create a branch: git checkout -b your-feature-name
    
3.  Make changes and commit: git commit -m "Added this cool thing"
    
4.  Push: git push origin your-feature-name
    
5.  Submit a pull request on the original repo.
    

I’d love your ideas—let’s make SwachhNet even better together!

Acknowledgments
---------------

Thanks to:

*   **Google Maps API:** For the awesome map integration.
    
*   **Gemini AI:** Powers the chatbot and image analysis.
    
*   **Cloudflare Workers & Firebase:** Hosting the backend and frontend.
    
*   **Open-Source Community:** React, Node.js, and more made this possible.
    
*   You, for keeping the world cleaner!
