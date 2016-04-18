import sys
from os import path
sys.path.append( path.dirname( path.dirname( path.dirname( path.abspath(__file__) ) ) ) )

from expressionParser import ExpressionParser

records = [
	{ 'speed': 3 },
	{ 'speed': 4 },
	{ 'speed': 9 }	
]
analysis_key = ""
expr = ". + 3"
column = "speed"
