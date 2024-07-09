import sys
import json
import numpy as np
import random
import pickle

while True :
    try :
        with open('Entire_Model.pkl','rb') as f:
            R = pickle.load(f)
        break
    
    except :
        continue

print(R.shape)

tmp = sys.argv[1]
parse = tmp.split('')
fin = []
fin.append(parse[4])
fin.append(parse[5])
fin.append(parse[2])
fin.append(parse[3])
fin.append(parse[0])
fin.append(parse[1])

new_user_data = []

for i in range(300) :
    val = 0
    if fin[i // 50 + 1] == "1":
        val = random.uniform(2.5, 3.5)       
    else :
        val = random.uniform(0.5, 1)
    new_user_data.append(val)

new_user = np.array(new_user_data)
print(new_user)

if len(R.shape) == 1 :
    R = new_user
else :
    R = np.vstack([R, new_user])

while True :
    try :
        with open('Entire_Model.pkl','wb') as f:
            pickle.dump(R, f)
        break
    
    except :
        continue

print("end")