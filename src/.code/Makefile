all: code
code:
	rsync *.js src/.code
	rsync -r ext/ src/.code/ext
	rsync Makefile src/.code
	rsync code.bat src/.code
clear:
	rm -rf ./build/.tmp ./build/check ./build/docs
.PHONY: all
