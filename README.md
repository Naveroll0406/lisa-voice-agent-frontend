# Lisa: AI Voice Assistant (Frontend) 🖥️✨

A stunning, highly responsive Next.js web application built to serve as the user interface for **Lisa**, an autonomous AI voice receptionist. This frontend connects seamlessly to the LiveKit voice infrastructure, providing users with a beautiful, real-time visual representation of the AI's "brain" as it talks, listens, and executes tools.

## 🌟 Key Features

- **Real-Time Avatar Lip-Syncing:** A custom SVG avatar (`AvatarTile.tsx`) that physically animates its mouth by processing live frequency bytes from the WebRTC audio track using the browser's native AudioContext API.
- **Live Transcript Panel:** Streams the user's and agent's speech to the screen in real-time, matching the exact latency of the voice engine.
- **Agent Action Feed (WebRTC Data Channels):** Intercepts raw JSON payloads over the WebRTC data channel to visually flash the precise database tools the agent is executing (e.g., "Fetching slots...", "Booking confirmed ✅").
- **Dynamic Summary Dashboard:** Automatically disconnects the room and flips the UI to a premium Summary Card when the agent completes the call, rendering the LLM-generated summary, appointments, and cost breakdowns.
- **Modern Glassmorphic Dark Aesthetic:** Styled with Tailwind CSS, utilizing a premium dark-theme aesthetic (`slate-900`) with sleek rounded corners, fixed layout constraints, and vibrant emerald accents.
- **Live User Profile Banner:** Top dashboard that displays the caller's database profile (New/Existing User, total appointments) securely bridged from the backend.
- **Remote Session Reloading:** The frontend intercepts a custom WebRTC `action: reload` payload published by the agent when you say "new user", automatically wiping and restarting the session seamlessly.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), React
- **Styling:** Tailwind CSS
- **Voice/WebRTC Integration:** `@livekit/components-react`, `livekit-client`

## 📦 Installation & Setup

1. **Clone the repository and enter the directory:**
   ```bash
   cd lisa-voice-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your LiveKit credentials so the Next.js server can mint connection tokens for the client:
   ```env
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_key
   LIVEKIT_API_SECRET=your_secret
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to interact with Lisa!

## 🧩 Component Architecture

- `CallRoom.tsx`: The primary orchestrator. Wraps the application in a `LiveKitRoom` context, strictly manages the `85vh` locked flex layout, and manages the transition to the summary dashboard.
- `AvatarTile.tsx`: The dynamic SVG avatar that analyzes audio frequencies for precise lip-syncing.
- `TranscriptPanel.tsx`: Subscribes to the LiveKit transcription events to render speech bubbles. It intelligently groups consecutive messages from the same speaker and features internal isolated scrolling.
- `ToolCallFeed.tsx`: Subscribes to custom WebRTC data payloads published by the Python backend to display real-time tool execution logs, extract user profile JSON, and trigger remote reloads.
- `UserProfile.tsx`: The top banner that displays the caller's database status and analytics.
- `SummaryCard.tsx`: The final dashboard rendered upon successful appointment booking and conversation completion.

