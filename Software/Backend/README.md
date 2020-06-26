# 花旗杯后端

# 使用技术

- Python 3（>=3.7）
- Flask
- SQLite + SQLAlchemy
- Flask-Restplus
- PyJWT
- Swagger

# 开发

## 学会用以下框架

看文档或者示例或者教程学会用以下教程，并看已有代码和注释学会套路。最重要的，

1. [Flask-RESTplus](https://flask-restplus.readthedocs.io/en/stable/index.html)
2. SQLAlchemy，[廖雪峰教程](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014320114981139589ac5f02944601ae22834e9c521415000)


## 安装依赖

`pip install -r requirements.txt`

## 进入Swagger文档

`http://localhost:5000/api`

## 数据库

数据库使用SQLite，使用SQLAlchemy与Python集成。为了保证数据库数据不会冲突，数据库文件已经加入.gitignore。运行flask的时候，flask会自动创建数据库文件。