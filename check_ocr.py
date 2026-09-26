import os
import sys

print("Python executable:", sys.executable)
try:
    import pytesseract
    print("pytesseract is installed!")
except ImportError:
    print("pytesseract is NOT installed.")

try:
    import easyocr
    print("easyocr is installed!")
except ImportError:
    print("easyocr is NOT installed.")
