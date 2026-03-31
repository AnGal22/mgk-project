from PIL import Image

src = r'C:\Users\antic\.openclaw\media\inbound\file_64---9a550262-e931-4832-b976-e5cf9abe9872.jpg'
out = r'C:\dev\mgk-project\public\logo-kukuljanovo.png'
img = Image.open(src).convert('RGBA')
new = []
for r, g, b, a in img.getdata():
    if r > 245 and g > 245 and b > 245:
        new.append((255, 255, 255, 0))
    else:
        new.append((r, g, b, a))
img.putdata(new)
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
img.save(out)
print(out)
