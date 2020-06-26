from model.invest.TransactionRecord import TransactionRecord


class StockTransactionsAdvice(object):
    # transactions: list[TransactionRecord]

    def __init__(self, transactions):
        self.transactions = transactions
