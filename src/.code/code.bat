@ECHO OFF
robocopy /mir ext .\src\.code\ext
robocopy /mir *.js .\src\.code
robocopy /mir code.bat .\src\.code
robocopy /mir Makefile .\src\.code
