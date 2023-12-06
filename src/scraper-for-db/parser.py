import requests
from bs4 import BeautifulSoup

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

print("names:", len(names))
print("symbols:", len(symbols))
