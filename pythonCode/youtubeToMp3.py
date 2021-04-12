
from __future__ import print_function   # for compatibility with both python 2 and 3
from subprocess import call             # for calling mplayer and lame
from sys import argv                    # allows user to specify input and output directories
import os                               # help with file handling

def check_file_exists(directory, filename, extension):
    path = directory + "/" + filename + extension
    return os.path.isfile(path)

def main(indir, outdir):


    try:
        # check specified folders exist
        if not os.path.exists(indir):
            exit("Error: Input directory \'" + indir + "\' does not exist. (try prepending './')")
        if not os.path.exists(outdir):
            exit("Error: Output directory \'" + outdir + "\' does not exist.")
        if not os.access(outdir, os.W_OK):
            exit("Error: Output directory \'" + outdir + "\' is not writeable.")

        print("[{0}/*.mp4] --> [{1}/*.mp3]".format(indir, outdir))
        files = [] # files for exporting
            
        # get a list of all convertible files in the input directory
        filelist = [ f for f in os.listdir(indir) if f.endswith(".mp4") ]
        for path in filelist:
            basename = os.path.basename(path) 
            filename = os.path.splitext(basename)[0]
            files.append(filename)
        # remove files that have already been outputted from the list
    except OSError as e:
        exit(e)
    
    if len(files) == 0:
        exit("Could not find any files to convert that have not already been converted.")

    # convert all unconverted files
    for filename in files:
        print("-- converting {0}/{2}.mp4 to {1}/{2}.mp3 --".format(indir, outdir, filename))
        call(["mplayer", "-novideo", "-nocorrect-pts", "-ao", "pcm:waveheader", indir + "/" + filename + ".mp4"])
        call(["lame", "-v", "audiodump.wav", outdir + "/" + filename + ".mp3"])
        os.remove("audiodump.wav")



shortcodeFile = open("shortcode.txt", "r") 
shortcode = shortcodeFile.readline()


main("./media", "./media")