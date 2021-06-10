import requests

shorcodeFile = open("shortcode.txt", "r")
url = shorcodeFile.readline()
shorcodeFile.close()

payload = {
    "url" : url,
    "ver" : 1306
}
r = requests.post("https://tvdl-api.saif.dev", data = payload)
r = r.json()
downloadUrl = r["high"]["downloadURL"]
r = requests.get(downloadUrl)
open("./media/twitterVideo.mp4", "wb").write(r.content)