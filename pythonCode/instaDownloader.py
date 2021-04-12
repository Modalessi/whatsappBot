import instaloader

import os


fileName = "shortcode.txt"
shortCodeFile  = open(fileName, "r")
shortCode = shortCodeFile.readline()



def deleteOldFiels() :
    folder = './media/insta'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            os.unlink(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

    
    


L = instaloader.Instaloader()
p = instaloader.Post.from_shortcode(L.context, shortCode)
try :
    deleteOldFiels()
    L.download_post(p, shortCode) 
except :
    pass
shortCodeFile.close()
