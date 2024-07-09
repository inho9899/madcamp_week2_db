import sys
import json
import numpy as np
import random
import pickle

def transpose(np_matrix):
    return np_matrix.T
    

def json_to_np(json_matrix):
    python_matrix = json.loads(json_matrix)  # JSON -> Python 객체
    numpy_matrix = np.array(python_matrix)   # Python 객체 -> NumPy 배열
    return numpy_matrix

def np_to_json(np_matrix):
    python_list = np_matrix.tolist()  # NumPy 배열 -> Python 리스트
    json_matrix = json.dumps(python_list)  # Python 리스트 -> JSON
    return json_matrix

def main():
    if len(sys.argv) != 2:
        print("Usage: python transpose.py <matrix>")
        sys.exit(1)
    
    user = int(sys.argv[1])

    # -------------------------------------------------------------
    # Your code here
    while True :
        try :
            with open('Entire_Model.pkl','rb') as f:
                R = pickle.load(f)
            break
        except :
            continue
    
    recommend_vector  = R[user - 1, :]
    
    # 0 ~ 299 : must return `res + 1`
    recommendation = np.argmax(recommend_vector) + 1
    # -------------------------------------------------------------
    # res_json = np_to_json(res_np)
    # print(res_json)
    print(recommendation)

if __name__ == "__main__":
    main()
