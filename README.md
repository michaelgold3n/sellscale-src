# MySellScaleHood

the simple investing interface that allows you to search for stock tickers, buy view trends, and manage your portfolio. Powered by YFinance API.

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


# NOTE:  The backend ports can be finnicky. It's currently set to run on port 5000, but feel free to change this, if your flask server starts on something different such as 5001. You may have to change the code in several places  so that it matches up with the flask server. 

 ## These are the files you'll want to change the port reference, depending on what your flask server is set at:
 1. constants.ts
 2. trendingco.tsx
 3. app.py at the bottom
