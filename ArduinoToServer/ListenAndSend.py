#!/usr/bin/python
"""
    Simple program structure
    
"""
#For parsing Arduino data
import re

#For communication with Arduino
import serial 

#for communication with Server
import requests
import json
#import numpy as np
import datetime
import time

print "Delay for connection"
time.sleep(5)

# Change the port name to match the port 
# to which your Arduino is connected. 
serial_port_name = 'COM3' #/dev/ttyACM0 for Rasberry Pi #COM3 For Windows
ser = serial.Serial(serial_port_name, 9600, timeout=1) 

baseurl = 'https://netfridge-jgilles.c9users.io/' #'https://netfridge-jgilles.c9users.io/?key=CE186' #'http://127.0.0.1:5000/'
 # Set query (i.e. http://url.com/?key=value).

delay = 0.1 # Delay in seconds
compressorDelay = 60 #Delay in seconds

# Run once at the start
def setup():
    try:
        print "Setup"
        global lastDoorState
        lastDoorState = 1
    except:
        print "Setup Error"

# Run continuously forever 
def getSerial(): 
    # Check if something is in serial buffer 
    if ser.inWaiting() > 0: 
        try: 
            # Read entire line 
            # (until '\n') 
            x = str(ser.readline())
            print ""            
            print "Received:",
            print x,
            #new line included in incoming message
            #print "Type:", type(x) 
            #send to the database
            toDatabase(x)
        except: 
            print "Error in Readind from Serial Port" 
             
    # 100 ms delay 
    time.sleep(0.1) 
    return 

def toDatabase(string1):
    #print string1  
    data = string1.split(",")
    
    if data[0].isdigit():
        m = True;
    else:
        print "Not real data"
        s = 2
        print "Sent to Arduino: ", s
        ser.write("2\n")
        return None
    
    #   0 - The first data point, don't actually know what it means
    #   1 - The unix time 
    #   2 - THe date and time in human form
    #   3 - THe tempature inside the fridge
    #   4 - THe tempature outside the fridge
    #   5 - The door position, 1 menas closed, 0 means open
    #   
    
    #turn the data into floats
    data[3] = float(data[3])
    data[4] = float(data[4])
    data[5] = int(data[5])
    
    #Get rid of bad temp values
    if data[3] == -1000:
        print "Bad fridge temperature"
        return None
    if data[4] == -1000:
        print "Bad outside temperature"
        return None
        
    # 
    # Send the data to the server
    #
    # Set url address.
    base = baseurl #+ '?key=CE186'
    # Set query (i.e. http://url.com/?key=value).
    query = {}
    # Set header.
    header = {'Content-Type':'application/json'}
    
    print "Send:",
    # Generature UNIX timestamps for each data point
    #at = int((datetime.datetime.utcnow() - datetime.datetime.utcfromtimestamp(0)).total_seconds())
    at = int(data[1])
    #print at
    
#    # Send Unix Time
#    endpoint = 'network/Demo/object/Waves/stream/Data3'
#    payload = [ {'value':{'unixTime':data[1], 'dateTime':data[2], 'fridgeTemp':data[3], 'outsideTemp':data[4], 'doorPos':data[5]} ,'at':at } ]
#    print data[1],",", data[2],",",data[3],",",data[4],",",data[5]
#    # Set body (also referred to as data or payload). Body is a JSON string.
#    body = json.dumps(payload)
#    # Form and send request. Set timeout to 2 minutes. Receive response.
#    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=120 )      
    
    # Send Unix Time
    endpoint = 'network/Demo/object/Waves/stream/Unix'
    payload = [ {'value':data[1],'at':at } ]
    print data[1],",",
    # Set body (also referred to as data or payload). Body is a JSON string.
    body = json.dumps(payload)
    # Form and send request. Set timeout to 2 minutes. Receive response.
    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    #print ""
    #print r    
    
    # Send Date Time
    endpoint = 'network/Demo/object/Waves/stream/DateTime'
    payload = [ {'value':data[2],'at':at } ]
    print data[2],",",
    # Set body (also referred to as data or payload). Body is a JSON string.
    body = json.dumps(payload)
    # Form and send request. Set timeout to 2 minutes. Receive response.
    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    
    # Send Fridge Temp
    endpoint = 'network/Demo/object/Waves/stream/FridgeTemp'
    payload = [ {'value':data[3],'at':at } ]
    print data[3],",",
    # Set body (also referred to as data or payload). Body is a JSON string.
    body = json.dumps(payload)
    # Form and send request. Set timeout to 2 minutes. Receive response.
    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    
    # Send Unix Time
    endpoint = 'network/Demo/object/Waves/stream/OutsideTemp'
    payload = [ {'value':data[4],'at':at } ]
    print data[4],",",
    # Set body (also referred to as data or payload). Body is a JSON string.
    body = json.dumps(payload)
    # Form and send request. Set timeout to 2 minutes. Receive response.
    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    
    # Send Unix Time
    endpoint = 'network/Demo/object/Waves/stream/DoorState'
    payload = [ {'value':data[5],'at':at } ]
    print data[5],
    # Set body (also referred to as data or payload). Body is a JSON string.
    body = json.dumps(payload)
    # Form and send request. Set timeout to 2 minutes. Receive response.
    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    print "."    
    
#    # Send Compressor On To Server
#    q = 11
#    endpoint = 'network/Demo/object/Waves/stream/CompressorState'
#    payload = [ {'value':q,'at':at } ]
#    print q,
#    # Set body (also referred to as data or payload). Body is a JSON string.
#    body = json.dumps(payload)
#    # Form and send request. Set timeout to 2 minutes. Receive response.
#    r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
#    print "."      
    
    #Turn light on for data sent to server
    ser.write("3\n") #3 Means data set received

#send the led value to teh serial port
def send_value(LEDValue):
    #check if something is in the serial buffer
    if ser.inWaiting() > 0:
        print "Data in serial port, write aborted."
    else:
        try:
            ser.write(str(LEDValue)) #write data to the serial port
            #time.sleep(15)
            #ser.flush() #remover the written data from the serial port input
        except:
            print "Error in serial write"

def getCompressor():
    #try to get data from the server
    # Set url address.
    base = baseurl #'https://netfridge-jgilles.c9users.io/?key=CE186' #'http://127.0.0.1:5000/'
    # Set query (i.e. http://url.com/?key=value).
    query = {}
    # Set header.
    header = {'Content-Type':'application/json'}
    try:
#        # Form and send request. Set timeout to 2 minutes. Receive response.
#        r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=120 )
#        print r
#        # Form and send request. Set timeout to 2 minutes. Receive response.
#        r = requests.request('get', base + endpoint, timeout=120 )
#        print r
        # Third, read the data from the LEDValue stream
        endpoint = 'network/Demo/object/Waves/stream/CompressorState'
        address = base + endpoint
        query = {'limit':1}
        
        #print "It got here"        
        
        # Form and send request. Set timeout to 2 minutes. Receive response.
        r = requests.request('get', address, params=query, headers=header, timeout=10 )
        
        #q = r.text
        #print str(q)
        #print "Type:", type(q) 
        #print q["objects"]
        #print r.text["objects"]
        q = json.loads( r.text )
        #print "Here is w: "
        #print q
        #print q['objects']['Waves']['streams']['CompressorState']
        w = q['objects']['Waves']['streams']['CompressorState']['points'][0]['value']
        #print w
        
        #Parse the incoming string to get out integers
        #print "Received from Server ", q
        #ints2 =  map(int, re.findall(r'\d+', q))
        print "Sent to Ardunio: ", w
        if w == 10:
            ser.write("10\n")
        elif w == 11:
            ser.write("11\n")
    except:
        print "Error in retreving data from server"
# Run continuously forever
# with a delay between calls
def delayed_loop():
    print "Delayed Loop"

# Run once at the end 
def close(): 
    try: 
        print "Close Serial Port" 
        ser.close() 
    except: 
        print "Close Error" 
        
def processDoor(currentDoorState, time):
    global lastDoorState
    #use global variable lastDoorState
    #This process decides the door has been opened and reports the times that
    #   the door has been opened
    #   1 - means closed
    #   0 - means open
    
    #varible that tells if the time should be reported    
    report = 0
    #figure out if should be reported
    if lastDoorState == 1:
        if currentDoorState == 1:
            report = 0
            lastDoorState = 1
        else:
            report = 0
            lastDoorState = 0
    else:
        if currentDoorState == 1:
            report = 1
            lastDoorState = 1
        else:
            report = 0
            lastDoorState = 0
    #print "Report: ", report, ", lastDoor", lastDoorState, ", currentDoor: ", currentDoorState
    
    if report == 1:
        #SEND THE TIME OF THE DOOR OPENING
        base = baseurl #'http://127.0.0.1:5000/'
        # Set query (i.e. http://url.com/?key=value).
        query = {}
        # Set header.
        header = {'Content-Type':'application/json'}
        # Generature UNIX timestamps for each data point
        at = int((datetime.datetime.utcnow() - datetime.datetime.utcfromtimestamp(0)).total_seconds())
        # Send Unix Time
        endpoint = 'network/Demo/object/Waves/stream/OpenTime'
        payload = [ {'value':time,'at':at } ]
        print ",",
        print time,
        # Set body (also referred to as data or payload). Body is a JSON string.
        body = json.dumps(payload)
        # Form and send request. Set timeout to 2 minutes. Receive response.
        r = requests.request('post', base + endpoint, data=body, params=query, headers=header, timeout=10 )
    
    
# Program Structure    
def main():
    # Call setup function
    setup()
    # Set start time
    nextLoop = time.time()
    nextCompressorLoop = time.time()
    while(True):
        # Try loop() and delayed_loop()
        try:
            if time.time() > nextLoop:
                # If next loop time has passed...
                nextLoop = time.time() + delay
                getSerial()
                #send_value(get_database()) #This line actually gets and sends the values
                #delayed_loop()
            if time.time() > nextCompressorLoop:
                #If next loop time has passed
                nextCompressorLoop = time.time() + compressorDelay
                getCompressor()
        except KeyboardInterrupt:
            # If user enters "Ctrl + C", break while loop
            break
        except:
            # Catch all errors
            print "Unexpected error."
            time.sleep(1)
    # Call close function
    close()

# Run the program
main()
