#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse, urlencode
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError
from json import JSONDecodeError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")


def _send_json(handler, status_code, payload):
    data = json.dumps(payload).encode("utf-8")
    handler.send_response(status_code)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def _send_file(handler, path):
    try:
        with open(path, "rb") as f:
            data = f.read()
    except FileNotFoundError:
        handler.send_error(404, "Not Found")
        return

    ext = os.path.splitext(path)[1].lower()
    content_type = "application/octet-stream"
    if ext == ".html":
        content_type = "text/html; charset=utf-8"
    elif ext == ".css":
        content_type = "text/css; charset=utf-8"
    elif ext == ".js":
        content_type = "application/javascript; charset=utf-8"

    handler.send_response(200)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/search":
            self._handle_api_search(parsed)
            return

        if parsed.path == "/":
            _send_file(self, os.path.join(STATIC_DIR, "index.html"))
            return

        # Static files
        if parsed.path.startswith("/static/"):
            rel = parsed.path[len("/static/"):]
            safe_path = os.path.normpath(rel).lstrip(os.sep)
            full_path = os.path.join(STATIC_DIR, safe_path)
            if not full_path.startswith(STATIC_DIR):
                self.send_error(400, "Bad Request")
                return
            _send_file(self, full_path)
            return

        self.send_error(404, "Not Found")

    def _handle_api_search(self, parsed):
        params = parse_qs(parsed.query)
        term = (params.get("q") or [""])[0].strip()
        lookback_days = _coerce_int((params.get("lookback_days") or ["30"])[0], 30)
        max_results = _coerce_int((params.get("max_results") or ["20"])[0], 20)

        if lookback_days < 1:
            lookback_days = 1
        if max_results < 1:
            max_results = 1
        if max_results > 100:
            max_results = 100

        gte_date = (datetime.utcnow().date() - timedelta(days=lookback_days)).isoformat()

        api_params = {
            "conditions[term]": term,
            "conditions[publication_date][gte]": gte_date,
            "per_page": str(max_results),
        }
        fields = [
            "title",
            "publication_date",
            "document_number",
            "agency_names",
            "html_url",
            "type",
        ]
        for f in fields:
            api_params.setdefault("fields[]", [])
            api_params["fields[]"].append(f)

        url = "https://www.federalregister.gov/api/v1/documents.json?" + urlencode(api_params, doseq=True)

        try:
            req = Request(url, headers={"User-Agent": "penn-ai-policy/1.0"})
            with urlopen(req, timeout=10) as resp:
                raw = resp.read().decode("utf-8")
                data = json.loads(raw)
        except HTTPError as e:
            _send_json(self, 502, {"ok": False, "error": f"Upstream HTTP error: {e.code}"})
            return
        except URLError as e:
            _send_json(self, 502, {"ok": False, "error": f"Upstream connection error: {e.reason}"})
            return
        except JSONDecodeError:
            _send_json(self, 502, {"ok": False, "error": "Upstream response was not valid JSON"})
            return
        except Exception as e:
            _send_json(self, 502, {"ok": False, "error": f"Upstream request failed: {str(e)}"})
            return

        results = data.get("results", [])
        filtered = []
        for item in results:
            filtered.append({
                "title": item.get("title"),
                "publication_date": item.get("publication_date"),
                "document_number": item.get("document_number"),
                "agency_names": item.get("agency_names"),
                "html_url": item.get("html_url"),
                "type": item.get("type"),
            })

        _send_json(self, 200, {"ok": True, "count": len(filtered), "results": filtered})

    def log_message(self, format, *args):
        # Keep output clean
        sys.stdout.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))


def _coerce_int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def main():
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Serving on http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Listening on http://0.0.0.0:{port}")
    server.serve_forever()
