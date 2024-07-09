import pickle
while True :
    try :
        with open('Entire_Model.pkl','rb') as f:
            res = pickle.load(f)
        break
    
    except :
        continue
print(res)