import pickle
import numpy as np

init_val = np.array([0])

while True :
    try :
        with open('Entire_Model.pkl','wb') as f:
            pickle.dump(init_val, f)
        break
    
    except :
        continue