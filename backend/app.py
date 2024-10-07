from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_NAME = "portfolio.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/search', methods=['GET'])
def search_stocks():
    query = request.args.get('query', '').upper()
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        ticker = yf.Ticker(query)
        info = ticker.info
        if 'symbol' in info:
            return jsonify({'symbol': info['symbol'], 'name': info['shortName']})
        else:
            return jsonify({'error': 'Ticker not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/quote', methods=['GET'])
def get_stock_quote():
    symbol = request.args.get('symbol', '').upper()
    if not symbol:
        return jsonify({'error': 'No ticker symbol provided'}), 400

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="2d")
        if hist.empty:
            return jsonify({'error': 'Unable to retrieve stock information'}), 404
        
        current_price = hist['Close'].iloc[-1]
        previous_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
        price_change = current_price - previous_close
        price_change_percent = (price_change / previous_close) * 100 if previous_close else 0
        
        return jsonify({
            'symbol': symbol,
            'name': ticker.info.get('longName', symbol),
            'price': current_price,
            'previousClose': previous_close,
            'priceChange': price_change,
            'priceChangePercent': price_change_percent
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/top_stocks', methods=['GET'])
def get_top_stocks():
    top_symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'UNH', 'JNJ']
    top_stocks = []
    for symbol in top_symbols:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="2d")
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                previous_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                price_change = current_price - previous_close
                price_change_percent = (price_change / previous_close) * 100 if previous_close else 0
                top_stocks.append({
                    'symbol': symbol,
                    'name': ticker.info.get('longName', symbol),
                    'price': current_price,
                    'previousClose': previous_close,
                    'priceChange': price_change,
                    'priceChangePercent': price_change_percent
                })
        except Exception:
            continue
    return jsonify({'data': top_stocks})

@app.route('/trade', methods=['POST'])
def trade_stock():
    data = request.get_json()
    action = data.get('action', '').lower()
    symbol = data.get('symbol', '').upper()
    quantity = data.get('quantity', 0)

    if action not in ['buy', 'sell']:
        return jsonify({'error': 'Invalid action'}), 400
    if not symbol:
        return jsonify({'error': 'No ticker symbol provided'}), 400
    if quantity <= 0:
        return jsonify({'error': 'Quantity must be positive'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        ticker = yf.Ticker(symbol)
        current_price = ticker.info.get('regularMarketPrice')
        if current_price is None or current_price == 0:
            hist = ticker.history(period="1d")
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
            else:
                return jsonify({'error': 'Unable to retrieve stock price'}), 400

        cursor.execute('SELECT quantity, average_price FROM portfolio WHERE symbol = ?', (symbol,))
        row = cursor.fetchone()

        if action == 'buy':
            if row:
                new_quantity = row['quantity'] + quantity
                new_average_price = ((row['average_price'] * row['quantity']) + (current_price * quantity)) / new_quantity
                cursor.execute('UPDATE portfolio SET quantity = ?, average_price = ? WHERE symbol = ?', (new_quantity, new_average_price, symbol))
            else:
                cursor.execute('INSERT INTO portfolio (symbol, name, quantity, average_price) VALUES (?, ?, ?, ?)', (symbol, ticker.info.get('longName', symbol), quantity, current_price))
            conn.commit()
            return jsonify({'message': f'Successfully bought {quantity} shares of {symbol} at ${current_price:.2f} each.'})
        elif action == 'sell':
            if row and row['quantity'] >= quantity:
                new_quantity = row['quantity'] - quantity
                if new_quantity == 0:
                    cursor.execute('DELETE FROM portfolio WHERE symbol = ?', (symbol,))
                else:
                    cursor.execute('UPDATE portfolio SET quantity = ? WHERE symbol = ?', (new_quantity, symbol))
                conn.commit()
                return jsonify({'message': f'Successfully sold {quantity} shares of {symbol} at ${current_price:.2f} each.'})
            else:
                return jsonify({'error': 'Insufficient shares to sell'}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT symbol, name, quantity, average_price FROM portfolio')
    rows = cursor.fetchall()
    portfolio = []

    for row in rows:
        try:
            ticker = yf.Ticker(row['symbol'])
            current_price = ticker.info.get('regularMarketPrice', 0)
            if current_price is None or current_price == 0:
                hist = ticker.history(period="1d")
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                else:
                    current_price = 0

            profit_loss = (current_price - row['average_price']) * row['quantity']
            profit_loss_percent = ((current_price - row['average_price']) / row['average_price']) * 100 if row['average_price'] else 0
            portfolio.append({
                'symbol': row['symbol'],
                'name': row['name'],
                'quantity': row['quantity'],
                'average_price': row['average_price'],
                'current_price': current_price,
                'profit_loss': profit_loss,
                'profit_loss_percent': profit_loss_percent
            })
        except Exception as e:
            print(f"Error fetching data for {row['symbol']}: {str(e)}")
            continue
    conn.close()
    return jsonify({'portfolio': portfolio})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)