"""Local-only Playwright practice server. Requires Python 3.10+, no packages."""
import argparse
import json
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).parent / 'dist'
PRODUCTS = [
    {'id': 'P101', 'name': 'Mechanical keyboard', 'price': 89, 'stock': 8},
    {'id': 'P102', 'name': 'Studio headphones', 'price': 129, 'stock': 5},
    {'id': 'P103', 'name': 'USB-C hub', 'price': 45, 'stock': 12},
    {'id': 'P104', 'name': 'Desk lamp', 'price': 35, 'stock': 0},
]

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def reply(self, status, payload):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == '/api/products':
            params = parse_qs(url.query)
            time.sleep(0.8)
            if params.get('fail') == ['1']:
                return self.reply(503, {'error': 'Warehouse temporarily unavailable'})
            query = params.get('q', [''])[0].lower()
            return self.reply(200, {'products': [p for p in PRODUCTS if query in p['name'].lower()]})
        if url.path == '/api/health':
            return self.reply(200, {'status': 'ok'})
        if url.path.startswith('/api/'):
            return self.reply(404, {'error': 'Unknown endpoint'})
        return super().do_GET()

    def do_POST(self):
        if self.path != '/api/orders':
            return self.reply(404, {'error': 'Unknown endpoint'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 10000:
                return self.reply(400, {'error': 'Invalid body size'})
            data = json.loads(self.rfile.read(size))
            quantities = data['items']
            if not isinstance(quantities, dict) or not quantities:
                raise ValueError()
            total = 0
            for key, quantity in quantities.items():
                product = next((p for p in PRODUCTS if p['id'] == key), None)
                if not product or type(quantity) is not int or not 1 <= quantity <= product['stock']:
                    raise ValueError()
                total += product['price'] * quantity
            if not isinstance(data.get('email'), str) or '@' not in data['email']:
                raise ValueError()
            if data.get('shipping') not in ('standard', 'express'):
                raise ValueError()
            if data.get('coupon') not in ('', 'LEARN10'):
                return self.reply(422, {'error': 'Unknown coupon'})
            total = round(total * (0.9 if data.get('coupon') == 'LEARN10' else 1), 2)
            total += 12 if data['shipping'] == 'express' else 0
        except (ValueError, KeyError, TypeError):
            return self.reply(422, {'error': 'Invalid order'})
        time.sleep(1)
        self.reply(201, {'id': 'ORD-1001', 'total': round(total, 2), 'status': 'confirmed'})

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(ROOT)))
    print(f'Playwright Lab: http://127.0.0.1:{args.port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
