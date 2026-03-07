# -*- coding: utf-8 -*-
import urllib.request
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

def send(from_id, to_id, text):
    data = json.dumps({"from": from_id, "to": to_id, "text": text}, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:7777/api/chat",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    resp = urllib.request.urlopen(req).read().decode("utf-8")
    print(resp)

if __name__ == "__main__":
    send(sys.argv[1], sys.argv[2], sys.argv[3])
