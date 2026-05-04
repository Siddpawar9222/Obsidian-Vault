# API Protocols — Complete Notes
> 8 Protocols · Industrial Use Cases

---

## Communication Direction — Quick Mental Model

| Direction | Protocols |
|---|---|
| Client asks → Server answers | REST, SOAP, GraphQL, gRPC |
| Server pushes → Client (one-way) | Webhooks, SSE |
| Both sides talk freely (two-way) | WebSockets |
| Browser talks directly to Browser | WebRTC |

---

## Protocol Foundation — What Sits on What

```
┌─────────────────────────────────────────────────┐
│   REST  GraphQL  SOAP  gRPC  Webhooks  SSE  HLS │  ← Application Layer
├─────────────────────────────────────────────────┤
│                  HTTP / HTTPS                   │  ← Transport Layer
├─────────────────────────────────────────────────┤
│                   TLS / SSL                     │  ← Security Layer (Encryption)
├─────────────────────────────────────────────────┤
│                    TCP / IP                     │  ← Foundation (Internet)
└─────────────────────────────────────────────────┘

WebRTC = Exception → Uses UDP directly (NOT HTTP/TCP)
```

> **Key rule:** HTTP is the road. REST, GraphQL, HLS etc. are just different vehicles on that road.

---

## 1. REST — Representational State Transfer

**Type:** Request-Response | **Data Format:** JSON | **Protocol:** HTTP/HTTPS

### Problem it solves
Before REST, every API had its own format and rules. REST gave a **universal, simple way** for apps to talk to each other using plain HTTP — no complex setup, just URLs and JSON.

### How it works
Uses standard HTTP methods:
- `GET` → Fetch data
- `POST` → Create data
- `PUT / PATCH` → Update data
- `DELETE` → Remove data

Each request is **independent** — server stores no memory of previous calls (**stateless**).

### Industrial Use Cases
- **Amazon / Flipkart** — product catalog APIs (fetch product details)
- **Razorpay / Stripe** — payment gateway APIs (create/check orders)
- **Twitter / Instagram** — social media APIs (post tweets, get followers)
- **OpenWeatherMap** — weather apps calling external data


---

## 2. SOAP — Simple Object Access Protocol

**Type:** Request-Response | **Data Format:** XML | **Protocol:** HTTP, SMTP, TCP

### Problem it solves
In banking and healthcare, data must be **100% correct, secure, and follow legal rules**. SOAP enforces strict rules so both sides agree on exact data structure — no surprises, no missing fields.

### How it works
- Messages are wrapped in an **XML envelope** (like a formal letter with specific sections)
- Uses **WSDL** (a contract file) to define exactly what data is sent/received
- Works over HTTP, SMTP, TCP

### Industrial Use Cases
- **NEFT / RTGS systems** — bank-to-bank money transfers in India
- **Hospital systems** — sharing patient records between hospitals
- **Insurance claim processing** systems
- **Legacy government services** and tax portals

---

## 3. gRPC — Google Remote Procedure Call

**Type:** Request-Response | **Data Format:** Protobuf (Binary) | **Protocol:** HTTP/2

### Problem it solves
REST sends **text (JSON)** which takes more space and time. When 100s of microservices talk to each other millions of times per day, even small delays add up. gRPC is **much faster** using binary data.

### How it works
- Uses **Protocol Buffers (Protobuf)** — compact binary format instead of JSON text
- Built on **HTTP/2** — supports multiplexing (many requests over one connection)
- You define a `.proto` file — both sides auto-generate code from it

### Industrial Use Cases
- **Google** — internal microservices (Search, Maps, Gmail talking to each other)
- **Netflix** — service-to-service calls between 1000+ microservices
- **Uber** — real-time location updates between backend services
- **Zomato / Swiggy** — order → kitchen → delivery service communication

---

## 4. GraphQL — Graph Query Language

**Type:** Request-Response | **Data Format:** JSON | **Protocol:** HTTP/HTTPS

### Problem it solves
With REST, you often get **too much data** (all user fields when you need only name) or **too little** (need separate calls for user + orders + reviews). GraphQL lets the client ask for **exactly what it needs** — nothing more, nothing less.

### How it works
- **Single endpoint** (`/graphql`) — no multiple URLs
- Client sends a **query** describing exactly what data shape it wants
- Server returns **exactly that structure**
- Think of it like ordering a custom thali — you pick exactly which items you want

### Industrial Use Cases
- **Facebook / Instagram** — each device fetches only the fields it needs
- **GitHub API v4** — developers query repo + issues + PRs in one call
- **Shopify** — mobile app fetches only product name + price + image
- **Twitter / X** — timeline with nested user + tweet + media in one query

---

## 5. Webhooks — Event-driven HTTP Callbacks

**Type:** Server → Client (one-way push) | **Data Format:** JSON | **Protocol:** HTTP/HTTPS

### Problem it solves
REST requires you to keep asking "has anything changed?" (**polling**) — this wastes resources. Webhooks flip this — the **server calls you when something actually happens**. Like a doorbell instead of constantly checking the door.

### How it works
1. You **register a URL** with the external service
2. When an event happens (payment done, order shipped), they send a **POST request to your URL**
3. Your server **receives and processes it instantly**

### Industrial Use Cases
- **Razorpay / Stripe** — notify your server when payment succeeds or fails
- **GitHub Actions** — trigger CI/CD pipeline when code is pushed
- **WhatsApp Business API** — receive messages sent to your business number
- **Shopify** — alert warehouse when a new order is placed

---

## 6. SSE — Server-Sent Events

**Type:** Server → Client (one-way stream) | **Data Format:** text/event-stream | **Protocol:** HTTP/HTTPS

### Problem it solves
Sometimes you need the server to **keep sending updates to the browser** — like live scores, news feed, or AI chat responses streaming word by word. WebSockets are heavy for this. SSE is simpler — just a **one-way stream** from server to client over plain HTTP.

### How it works
- Client opens **one HTTP connection** and keeps it open
- Server sends **data chunks** whenever ready using `text/event-stream` format
- **Auto-reconnects** if connection drops
- Works **natively in browsers** — no extra libraries needed

### Industrial Use Cases
- **ChatGPT / Claude** — streaming AI responses word by word to browser
- **Stock market dashboards** — live price updates in browser
- **Cricbuzz / ESPN** — cricket/football live score updates
- **Social media** — live notification feeds (likes, comments appearing in real-time)

---

## 7. WebSockets — Full-duplex Real-time Connection

**Type:** Two-way (bidirectional) | **Data Format:** Any | **Protocol:** ws:// / wss://

### Problem it solves
HTTP is request-response — **client always initiates**. For chat apps or multiplayer games, **both sides need to send messages at any time** without waiting. WebSockets create a permanent **two-way tunnel** — like a phone call instead of sending letters.

### How it works
- Starts as an HTTP connection, then **"upgrades"** to WebSocket protocol
- After upgrade, both server and client can send messages **any time** without reconnecting
- Very **low latency** — no HTTP headers repeated each time

### Industrial Use Cases
- **WhatsApp / Slack** — real-time chat with read receipts
- **Google Docs** — multiple users editing same document simultaneously
- **Online multiplayer games** — player position updates in real-time
- **Zerodha Kite** — live trading terminal with bid/ask updates

---

## 8. WebRTC — Web Real-Time Communication

**Type:** Peer-to-Peer | **Data Format:** Audio/Video/Data | **Protocol:** UDP (NOT HTTP)

### Problem it solves
Video calls through a server create **delay and cost** — all audio/video passes through a central machine. WebRTC lets two browsers **communicate directly (peer-to-peer)** — no server in the middle for media.

### How it works
- Uses **ICE/STUN/TURN** servers just to establish the initial connection (like exchanging phone numbers)
- After that, **audio/video/data flows directly** browser-to-browser
- Handles NAT traversal, encryption (DTLS/SRTP), and codec negotiation automatically
- Uses **UDP** — drops lost packets instead of waiting (better for live calls)

### Industrial Use Cases
- **Google Meet / Zoom** — browser-based video/audio calls
- **WhatsApp Web** — video calls directly between two browsers
- **Omegle-type apps** — random stranger video chat
- **Online proctoring tools** — screen sharing + video in exams

---

## OTT Video Streaming Protocols (Bonus)

> OTT platforms like Netflix, Hotstar, YouTube use a different set of protocols for video delivery.

| Protocol | Full Name | Used By | Purpose |
|---|---|---|---|
| **HLS** | HTTP Live Streaming | Apple, Hotstar, YouTube | Deliver video chunks over HTTP |
| **MPEG-DASH** | Dynamic Adaptive Streaming over HTTP | Netflix, YouTube | Open standard, same as HLS |
| **RTMP** | Real-Time Messaging Protocol | YouTube Live (upload side) | Streamer's OBS → YouTube server |
| **WebRTC** | Web Real-Time Communication | Zoom, Google Meet | Ultra-low latency live calls |

### How OTT Streaming Works (ABR — Adaptive Bitrate)

```
Raw Video (4K)
     ↓
Encoder / Transcoder
     ↓
Multiple quality versions: 1080p | 720p | 480p | 360p | 144p
     ↓
Each version cut into 2–10 second chunks
     ↓
Stored on CDN (Content Delivery Network)
     ↓
ABR Player on your device
  → Measures bandwidth every few seconds
  → Good network   → fetches 1080p chunks
  → Average network → fetches 480p chunks
  → Slow network   → fetches 144p chunks
     ↓
Buffer + Seamless Playback on screen
```

> **Netflix secret:** They use their own CDN called **Open Connect** — servers placed physically inside your ISP (Jio, Airtel) in India. That's why Netflix loads so fast even on mobile.

---

## Common Interview Questions

### SSE vs WebSockets

| Feature | SSE | WebSockets |
|---|---|---|
| Direction | Server → Client only | Both sides |
| Protocol | Plain HTTP | ws:// (upgrades from HTTP) |
| Complexity | Simple | More complex |
| Auto-reconnect | Yes (built-in) | Manual |
| Use case | AI streaming, live scores | Chat, trading, games |

### REST vs SOAP

| Feature | REST | SOAP |
|---|---|---|
| Format | JSON | XML |
| Flexibility | High | Low (strict) |
| Security | Good | Very high |
| Speed | Fast | Slower |
| Used in | Web/mobile APIs | Banks, hospitals |

### REST vs GraphQL

| Feature | REST | GraphQL |
|---|---|---|
| Endpoints | Multiple (`/users`, `/orders`) | Single (`/graphql`) |
| Data fetching | Fixed response | Ask exactly what you need |
| Over-fetching | Common | Never |
| Used in | General APIs | Mobile apps, complex UIs |

---

## When to Use What — Decision Guide

| Situation | Use |
|---|---|
| Build a product/user API | **REST** |
| Bank / hospital / legal system | **SOAP** |
| 100+ microservices talking to each other | **gRPC** |
| Mobile app needs flexible data | **GraphQL** |
| Payment / order event notification | **Webhooks** |
| AI response streaming / live scores | **SSE** |
| Real-time chat / stock trading | **WebSockets** |
| Video / voice calls | **WebRTC** |
| OTT video delivery (Netflix/Hotstar) | **HLS / MPEG-DASH** |

---

## Full Protocol Stack (How it layers)

```
TCP/IP          → Reliable data delivery (foundation of internet)
    ↑
TLS / SSL       → Encryption (HTTP → HTTPS, ws → wss)
    ↑
HTTP / HTTPS    → Request-response transport (language of the web)
    ↑
REST / GraphQL / SOAP / gRPC / Webhooks / SSE / WebSockets / HLS / DASH
                → Application-level rules (your business logic)

Exception:
WebRTC → Uses UDP directly (bypasses HTTP for ultra-low latency)
```

> **Interview answer for "what is REST built on?"**
> REST is built on HTTP → which is built on TCP/IP → which optionally uses TLS to become HTTPS.

---