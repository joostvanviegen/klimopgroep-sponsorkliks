from bs4 import BeautifulSoup
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from selenium import webdriver
from urllib.parse import urlparse
import json
import re
import time

try:
    response = get("https://www.sponsorkliks.com/products/shops.php?show=all")

    if(response.status_code == 200):
        html = BeautifulSoup(response.content, 'html.parser')
        shopsHtml = html.find_all("a", class_="btn btn-xs btn-primary orderlink")
        shops = {}
        i = 0
        driver = webdriver.Firefox()

        for s in shopsHtml:
            strings = str(s)
            print(strings)
            driver.get("https://sponsorkliks.com" + s.get('href'))
            time.sleep(15)
            targetUrl = driver.current_url
            targetUrl = str(targetUrl)
            targetUrl = urlparse(targetUrl)
            targetUrl = targetUrl.hostname
            targetUrl = targetUrl.replace("www.", "")
            print(targetUrl)

            domain = targetUrl
            name = re.findall("shop=([^&]+)&", strings)
            id = re.findall("shop_id=([0-9]+)&", strings)

            print ("id = " + id[0])
            print ("name = " + str(name))
            print ("domain = " + str(domain))    

            shop = {
                        "id": id[0],
                        "name": name[0],
                        "domain": domain
            }
            shops[i] = shop
            i += 1
            print("bij " + str(i) + " van de " + str(len(shopsHtml)))

        print (json.dumps(shops))
        file = open("shops.json", "w+")
        file.write(str(json.dumps(shops)))
        file.close()
        driver.quit()

    else:
        print("er is iets misgegaan")

except RequestException as exception:
    print("exception" + exception)
