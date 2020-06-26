import numpy as np
import numpy.random as npr
npr.seed(0)
import matplotlib.pyplot as plt
import pandas as pd
from cvxopt  import solvers, matrix

if __name__ == "__main__":
    # configuration
    csv_list = ["hushen300.csv", "yuanyou.csv", "zhongzheng.csv"] # the relative datapath of the csv files
    a = np.array([0., 0., 0.]) # the current investment
    w_sum = 100. # total value of investment
    anticipated_risk = 0.1
    mu = 0.075 # anticipated return rate
    
    # start
    num = len(csv_list)
    a_sum = a.sum()
    data = []
    for i in range(num):
        data.append(list(np.array(pd.read_csv(csv_list[i], index_col=0)).reshape(-1)))
    data = np.array(data)
    T = data.shape[1]
    r = data.mean(axis=1)
    d = data - np.dot(r.reshape(-1,1), np.ones((1, T)))
    sigma = np.dot(d, d.T) / (T - 1)

    # set up the qp solver by generating the matrices
    P = 2 * matrix(sigma, tc='d')
    q = matrix(np.dot(sigma, a.reshape(-1, 1)).reshape((-1)) * 2, tc='d')
    G = matrix(np.vstack((-np.eye((num)), -r.reshape((1, -1)))), tc='d')
    h = matrix(np.vstack((np.zeros((num, 1)), np.array([np.dot(a, r) - (w_sum + a_sum) * mu]).reshape(-1, 1))).reshape((-1)), tc='d')
    A = matrix(np.ones((1, num)), tc='d')
    b = matrix(w_sum, tc='d')
    try:
    	print("start optimizing...")
        sv = solvers.qp(P, q, G, h, A, b)
    except:
    	print("Sorry, the anticipated return rate \mu={} can't be met!".format(mu))
        exit()

    # compute the output result
    w = np.array(sv['x']).reshape(-1)
    w = w / w.sum() * w_sum
    w_perc = w / w_sum
    temp = (w + a) / (w_sum + a_sum)
    min_risk = (np.dot(np.dot(temp.reshape((1, -1)), sigma), temp.reshape((-1, 1))))[0, 0]
    exp_r = np.dot(temp, r)

    if min_risk > anticipated_risk:
        print("Attention: the anticipated return rate could be met but with higher risks!")
    else:
        print("This strategy is perfect!")
    print("Investment to each market: {}".format(list(w)))
    print("Investment proportion: {}".format(list(w_perc)))
    print("Average return rate for each market: {}".format(list(r)))
    print("Minimum risk: {}".format(min_risk))
    print("Expected return rate: {}".format(exp_r))
