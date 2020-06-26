from model.news.News import News
import pandas as pd

from run import db
import traceback

class NewsDao(object):
    def get_all_news(self):
        pd.set_option('max_colwidth', 20000)
        list = []
        df = pd.read_csv('data/news.csv').values
        for i in range(30):
            # print(df[i][1])
            news = News(df[i][1], df[i][2], df[i][3])
            list.append(news)

        return list

    def get_one_news(self, id):
        try:
            session = db.session()
            news = session.query(News).filter(News.id == id)[0]
            session.close()
            return news
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass