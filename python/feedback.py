import sys
import json
import numpy as np
import random
import pickle

from numpy.linalg import svd
  
user = int(sys.argv[1])
item = int(sys.argv[2])
rate = int(sys.argv[3])

alpha = 0.015

# R ij input
# i <= user, j <= item
i = user - 1
j = item - 1

while True :
    try :
        with open('Entire_Model.pkl','rb') as f:
            R_hat = pickle.load(f)
        break
    except :
        continue

U_L, sigma, Vt = svd(R_hat, full_matrices=False)

U = np.dot(U_L, np.diag(sigma))
I = Vt

# R_hat ij > Expected rating
for r in range(i):
    for c in range(j):
        eij = rate - R_hat[r, c]
        for k in range(Vt.shape[0]) :
            if R_hat[r, c] > 0:  # R[i, j]가 0이 아닌 경우에만 업데이트
                U[i, k] = U[i, k] + alpha * (2 * eij * I[k, j])
                I[k, j] = I[k, j] + alpha * (2 * eij * U[i, k])
                

# e ij = R ij - R_hat ij

# R = U x I

R = U @ I

# p' ik = p ik + 2 a e_ij  q kj

# q' ik = p ik + 2 a e_ij  p kj

while True :
    try :
        with open('Entire_Model.pkl','wb') as f:
            pickle.dump(R, f)
        break
    except :
        continue