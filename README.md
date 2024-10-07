# MySellScaleHood

a simplified stock trading application that allows you to search for stock tickers, buy view trends, and manage your portfolio. With YFinance API.

## tech stack

frontend - typescript
backend - flask
storage - SQLite db

---

## getting started


### front

1. **cd into `frontend`**
    ```bash
    cd frontend
    ```

2. **npm**
    ```bash
    npm i
    ```

3. **run in dev mode**
    ```bash
    npm run dev
    ```


### flask backend

1. **cd into `backend`**
    ```bash
    cd backend
    ```

2. **venv**
    ```bash
    python -m venv env
    source env/bin/activate
    ```

3. **dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4. **start db**
    ```bash
    python init_db.py
    ```

5. **run server**
    ```bash
    python app.py #if needed, python3 app.py
    ```


frontend on `http://localhost:3000` and backend on `http://localhost:5001`.

---

## Technical Checklist

- **Frontend**: typescript + nextjs
- **Backend**: flask + yfinance
- **Database**: SQLite