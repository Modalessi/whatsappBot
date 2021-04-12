from pytube import YouTube


fileName = "shortcode.txt"
shortCodeFile  = open(fileName, "r")
shortCode = shortCodeFile.readline()


video = YouTube(shortCode)
stream = video.streams.first()
stream.download(output_path="media/", filename="youtubeVideo")


shortCodeFile.close()
