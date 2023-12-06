import uuid
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client

load_dotenv()
website_url = "https://www.morningstar.com/stocks"

r = requests.get(website_url)
names = []
symbols = []

soup = BeautifulSoup(r.text, "html.parser")

# retrieving all three types of stocks: Tech, Fin Services, and Communication Services:
sth = soup.find("div", attrs={"class": "mdc-carousel__inner"})
for ul in sth.find_all("ul"):
    for span in ul.find_all("span"):
        currStr = span.get_text().replace("\n", "").replace("\t", "")
        names.append(currStr.strip()[0 : currStr.index("(")])
        symbols.append(currStr.strip()[currStr.index("(") : len(currStr.strip())])

data = []

url: str = os.environ.get("VITE_SUPABASE_CLIENT_URL")
key: str = os.environ.get("VITE_SUPABASE_CLIENT_PW")
supabase: Client = create_client(url, key)

if url is None:
    print("oop")

# inserting the data:
for i in range(len(names)):
    uuid_int = int.from_bytes(uuid.uuid4().bytes, byteorder="big", signed=False)
    uuid_int_within_range = uuid_int % (2**63 - 1) - (2**63 - 1)
    sth, count = (
        supabase.table("ValidStocks")
        .insert({"id": uuid_int_within_range, "Ticker": symbols[i], "Name": names[i]})
        .execute()
    )
