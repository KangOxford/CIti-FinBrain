from sklearn.cluster import KMeans, DBSCAN
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import LocalOutlierFactor
import pandas as pd
from sklearn.metrics import classification_report
from sklearn.externals import joblib

from factory import DaoFactory


# 训练一个kmeans模型
def train_kmeans():
    # read data
    people = pd.read_csv("data/train_kmeans.csv", header=None)
    kmeans = KMeans(n_clusters=5, random_state=0)
    # outlier detection
    clf = LocalOutlierFactor(n_neighbors=20, contamination=0.01)
    outlier_pre = clf.fit_predict(people)
    normal_people = people[outlier_pre == 1][:]
    # print(normal_people) 
    # kmeans
    kmeans.fit(normal_people)
    kmeans_pre = kmeans.predict(people)
    # print(kmeans_pre[0:499])
    # print(kmeans_pre[500:999])
    # print(kmeans_pre[1000:1499])
    # print(kmeans_pre[1500:1999])
    # print(kmeans_pre[2000:2499])
    # kmeans report
    target_names = ['class 1', 'class 2', 'class 3', 'class 4', 'class 5']
    y_true = [3] * 500 + [0] * 500 + [4] * 500 + [1] * 500 + [2] * 500
    print(classification_report(y_true, kmeans_pre, target_names=target_names))
    joblib.dump(kmeans, "data/kmeans_model.m")
    return kmeans


def request_check(p_request, account):
    # 收益 风险 金额 金额还需要更改，现在用的是初始的金额，应该改为目前的资产价值
    if p_request[0] <= account.seven_revenue and p_request[1] >= account.seven_risk and p_request[2] >= account.amount:
        return True
    else:
        return False


# 收益比风险，对符合要求的账户进行打分排序
def score_account(conform_account):
    best_three = []
    for _ in range(3):
        best_account = conform_account[0]
        for account in conform_account:
            if account.seven_revenue / account.seven_risk > best_account.seven_revenue / account.seven_risk:
                best_account = account
        best_three.append(best_account.Position)
        conform_account.remove(best_account)
    return best_three


# p_attr每个用户的api的三个属性，p_request用户的3个要求，返回一个资产配置的list
# todo 预先训练模型，用户可以调用recommend方法
def recommend(p_attr, p_request):
    # 需要预先训练kmeans模型
    kmeans = joblib.load("data/kmeans_model.m")
    user_type = kmeans.predict(p_attr)
    account_list = DaoFactory.recommendationDao.get_account_list_by_user_type(user_type)
    conform_account = []
    for account in account_list:
        if request_check(p_request, account):
            conform_account.append(account)
    if len(conform_account) > 3:
        best_three = score_account(conform_account)
        return best_three
    else:
        return [account.Position for account in conform_account]
