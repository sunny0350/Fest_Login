from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import csv
from urllib.parse import parse_qs
from datetime import datetime
import os

class FestRegistrationHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/register':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            registration_data = json.loads(post_data.decode('utf-8'))
            
            # Add timestamp
            registration_data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # CSV file path
            csv_file = 'registrations.csv'
            is_new_file = not os.path.exists(csv_file)
            
            # Write to CSV
            with open(csv_file, 'a', newline='') as file:
                writer = csv.DictWriter(file, fieldnames=['timestamp', 'fullName', 'email', 'college', 'category'])
                if is_new_file:
                    writer.writeheader()
                writer.writerow(registration_data)
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success'}).encode())
            return
        
        return SimpleHTTPRequestHandler.do_POST(self)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, FestRegistrationHandler)
    print('Server running on port 8000...')
    httpd.serve_forever()