import urllib
import urllib.request
import urllib.robotparser
import time
import bs4
import csv
from urllib.parse import urlparse

pokemon_names = []
with open("pokemon_alopez247.csv") as csvfile:
    rows = csv.reader(csvfile)
    for row in rows:
        time.sleep(.5)
        pokemon_name = row[1].lower()
        try:
            url = "https://www.pokemon.com/us/pokedex/" + pokemon_name

            p = urlparse(url)
            hostname = p.hostname
            scheme = p.scheme

            if hostname is not None:
                rp = urllib.robotparser.RobotFileParser()
                rp.set_url(scheme + "://" + hostname + '/robots.txt')
                rp.read()
                if not rp.can_fetch('UCD-ECS272-yichlin', url):
                    print("crawler not welcomed")

            req = urllib.request.Request(url, headers={'User-Agent': 'UCD-ECS272-yichlin'})
            web_page = urllib.request.urlopen(req)
            contents = web_page.read().decode(errors="replace")

            soup = bs4.BeautifulSoup(contents, "lxml")
            img_url = soup.find_all("img", class_="active")[0]['src']
            urllib.request.urlretrieve(img_url, row[0] + ".png")
        except:
            print(row[0]+" "+row[1]+" ERROR")

