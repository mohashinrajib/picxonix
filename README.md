PicXonix
===============

PicXonix is a sort of framework for making [Xonix](https://en.wikipedia.org/wiki/Xonix) clones on JavaScript/Canvas. It features a picture (image) hidden behind the playing field, with added features like eating bonus like snake game. Original code borrowed from https://github.com/hindmost/picxonix


License
-------------
PicXonix is released under the [MIT License](http://www.opensource.org/licenses/MIT).

Development
-----------
This project uses ES modules. To run the demo locally you must serve the files over HTTP (browsers block module imports from file://). A simple way is to run a local static server in the project folder, for example with Python 3:

```sh
# from the project root
python -m http.server 8000
```

Then open http://localhost:8000/index.html in your browser.
