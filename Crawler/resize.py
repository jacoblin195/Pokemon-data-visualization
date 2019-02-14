
import PIL.Image as Image

import os, sys
cwd = os.getcwd()

# for num in range(1,722):
#     im = Image.open(cwd+"\\icons\\"+str(num)+".png")
#     im = im.resize((200, 200), Image.ANTIALIAS)
#     im.save(str(num)+".png")
im = Image.open("ball.png")
im = im.resize((40, 40), Image.ANTIALIAS)
im.save("ball.png")