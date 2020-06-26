import json
import uuid
import requests
import base64

import config


def getRealAccessToken(username, encrypted_password):
    encode_key = config.client_id + ':' + config.client_key
    authorization = 'Basic ' + str(base64.b64encode(encode_key.encode('utf-8')), 'utf-8')
    u = str(uuid.uuid1())

    payload = {
        'grant_type': 'password',
        'scope': '/api',
        'username': username,
        'password': encrypted_password
    }
    headers = {
        'authorization': authorization,
        'bizToken': config.bizToken,
        'uuid': u,
        'content-type': "application/x-www-form-urlencoded",
        'accept': 'application/json'
    }
    r = requests.post("https://sandbox.apihub.citi.com/gcb/api/password/oauth2/token/hk/gcb", data=payload,
                      headers=headers)
    return json.loads(str(r.text))['access_token']


def retrieveDestSrcAcct(access_token):
    authorization = 'Bearer ' + access_token
    u = str(uuid.uuid1())
    headers = {
        'authorization': authorization,
        'client_id': config.client_id,
        'uuid': u,
        'accept': 'application/json'
    }
    params = {
        'paymentType': 'ALL'
    }
    r = requests.get("https://sandbox.apihub.citi.com/gcb/api/v1/moneyMovement/payees/sourceAccounts", params=params,
                     headers=headers)
    text = json.loads(r.text)
    return text['sourceAccounts']


def createPurchaseTransfer(source_account_id, access_token, invest_amount):
    authorization = 'Bearer ' + access_token
    u = str(uuid.uuid1())
    payload = {
        "sourceAccountId": source_account_id,
        "transactionAmount": invest_amount,
        "transferCurrencyIndicator": "SOURCE_ACCOUNT_CURRENCY",
        "payeeId": "7977557255484c7345546c4e53424766634b6c53756841672b556857626e395253334b70416449676b42673d",
        "chargeBearer": "BENEFICIARY",
        "fxDealReferenceNumber": "12345678",
        "remarks": "DOM Internal Transfer"
    }
    headers = {
        'authorization': authorization,
        'client_id': config.client_id,
        'uuid': u,
        'accept': 'application/json',
        'content-type': 'application/json'
    }
    r = requests.post("https://sandbox.apihub.citi.com/gcb/api/v1/moneyMovement/internalDomesticTransfers/preprocess",
                      data=json.dumps(payload), headers=headers)
    text = json.loads(r.text)
    return confirmInternalTransfer(text['controlFlowId'])


def retrievePayeeList(access_token):
    authorization = 'Bearer ' + access_token
    u = str(uuid.uuid1())
    headers = {
        'authorization': authorization,
        'client_id': config.client_id,
        'uuid': u,
        'accept': 'application/json'
    }
    params = {
        'paymentType': 'ALL'
    }
    r = requests.get("https://sandbox.apihub.citi.com/gcb/api/v1/moneyMovement/payees", params=params, headers=headers)
    print(r.text)
    pass


def createRedeemTransfer(amount, payee_id):
    access_token = getRealAccessToken(config.system_username, config.system_password)
    authorization = 'Bearer ' + access_token
    u = str(uuid.uuid1())
    payload = {
        "sourceAccountId": '41375159436b366b32335a6b566d53315753684d2b69464f43427347654b496e2f6a4f6d4971546e622f773d',
        "transactionAmount": amount,
        "transferCurrencyIndicator": "SOURCE_ACCOUNT_CURRENCY",
        "payeeId": payee_id,
        "chargeBearer": "BENEFICIARY",
        "fxDealReferenceNumber": "12345678",
        "remarks": "DOM Internal Transfer"
    }
    headers = {
        'authorization': authorization,
        'client_id': config.client_id,
        'uuid': u,
        'accept': 'application/json',
        'content-type': 'application/json'
    }
    r = requests.post("https://sandbox.apihub.citi.com/gcb/api/v1/moneyMovement/internalDomesticTransfers/preprocess",
                      data=json.dumps(payload), headers=headers)
    text = json.loads(r.text)
    return confirmInternalTransfer(text['controlFlowId'])


def confirmInternalTransfer(access_token, control_flow_id):
    authorization = 'Bearer ' + access_token
    u = str(uuid.uuid1())
    payload = {
        "controlFlowId": control_flow_id
    }
    headers = {
        'authorization': authorization,
        'uuid': u,
        'accept': "application/json",
        'client_id': config.client_id,
        'content-type': "application/json"
    }
    r = requests.post("https://sandbox.apihub.citi.com/gcb/api/v1/moneyMovement/internalDomesticTransfers",
                      data=json.dumps(payload), headers=headers)
    text = json.loads(r.text)
    return text
