from sclib import SoundcloudAPI, Track, Playlist


fileName = "shortcode.txt"
shortCodeFile  = open(fileName, "r")
shortCode = shortCodeFile.readline()

api = SoundcloudAPI()  # never pass a Soundcloud client ID that did not come from this library

track = api.resolve(shortCode)

# https://soundcloud.com/salehhadad/undefeated-will?ref=clipboard&p=i&c=0

assert type(track) is Track

filename = f'./media/soundcloudFile.mp3'

with open(filename, 'wb+') as fp:
    track.write_mp3_to(fp)


shortCodeFile.close()