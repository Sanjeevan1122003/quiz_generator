# 📘 QuizGenius — AI-Powered Wikipedia Quiz Generator

QuizGenius is a full-stack application that converts any **Wikipedia article URL** into a fully structured **multiple-choice quiz**.  
It scrapes Wikipedia content, processes it with the Gemini LLM, and stores quizzes in a database.  
The React frontend allows users to generate quizzes and view their entire quiz history.

---

## 🚀 Features

### 🔍 Wikipedia Scraping
- Scrapes article content using BeautifulSoup  
- Removes unnecessary HTML (tables, references, scripts, etc.)  
- Extracts:
  - Title  
  - Sections  
  - Clean article text  
  - Basic entities (people, places, organizations)

### 🤖 AI Quiz Generation (Gemini 2.0 Flash)
- Produces **5–20 MCQs** with:
  - Difficulty levels  
  - Explanations  
  - Key entities  
  - Topics  
  - Strict JSON formatting  
- Automatically fixes nested quiz structures (`quiz`, `quiz.quiz`, etc.)

### 🗄️ History Storage
Stored via MySQL/SQLite:
- URL  
- Title  
- Scraped content  
- Full quiz JSON  
- Timestamp  

### 💻 React Frontend UI
- Generate Quiz tab  
- History tab with modal preview  
- Proper error messages  
- Loaders & graceful fallbacks  
- Clean interface using TailwindCSS

### 🛡 Robust Error Handling
Covers:
- Invalid or empty URLs  
- Non-Wikipedia URLs  
- Scraping failures  
- AI errors  
- Server offline  
- Database errors  
- Empty/invalid quiz responses  

---

## 🧱 Tech Stack

### **Backend**
- FastAPI  
- SQLAlchemy  
- MySQL / SQLite  
- BeautifulSoup  
- Google Gemini API  

### **Frontend**
- React.js  
- TailwindCSS  

---

## 🗂️ Folder Structure
```
quizgenius/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── scraper.py
│   ├── llm_quiz_generator.py
│   ├── database.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── services/api.js
│   │   ├── components/
│   │   │   ├── Tabs.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── QuizDisplay.jsx
│   │   │   ├── HistoryTable.jsx
│   │   └── tab/
│   │       ├── GenerateQuizTab.jsx
│   │       └── HistoryTab.jsx
│   ├── public/
│   ├── package.json
│
└── README.md
```
## Backend Setup

1 Install dependencies
```
cd backend
pip install -r requirements.txt
```

2 Create .env file
```
GOOGLE_API_KEY=YOUR_KEY
DATABASE_URL=mysql+pymysql://username:password@localhost/quizgenius
```
(Or leave default SQLite.)


3 Run server
```
uvicorn main:app --reload

```
Runs on: 
```
http://127.0.0.1:8000
```

## Frontend Setup

Install dependencies
```
cd frontend
npm install
```

Run React app
```
npm run dev
```

Runs on: http://localhost:5173

## How to Use

Generate Quiz:

1 Open Generate Quiz tab

2 Enter Wikipedia URL

3 Click Generate

4 Quiz appears below

View History:

1 Open History tab

2 Click Details to open quiz modal

## API Endpoints
```
POST /generate_quiz
GET /history
GET /quiz/{id}
```

## ✨ Author

**Sanjeevan Thangaraj**  
📧 [sanjeevan1122003@gmail.com]  
🔗 [GitHub Profile](https://github.com/Sanjeevan1122003/)

