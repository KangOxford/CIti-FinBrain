import smtplib
from email.header import Header
from email.mime.text import MIMEText


def email_message(username, email, content, subject):
    """
    给用户发送邮件

    :param username: 用户名
    :param email: 用户邮箱
    :param content: 邮件内容
    :param subject: 邮件主题
    """
    smtp_server = 'smtp.163.com:587'

    sender = 'a_plus_quant@163.com'
    receivers = [email]

    message = MIMEText('尊敬的A+Quant用户 %s ，您好！\n' % username + content, 'plain', 'utf-8')
    message['From'] = 'A+Quant<%s>' % sender  # 发送者
    message['To'] = ';'.join(receivers)  # 接收者

    message['Subject'] = Header(subject, 'utf-8')

    try:
        smtp_obj = smtplib.SMTP_SSL(smtp_server)
        # smtpObj.set_debuglevel(1)
        smtp_obj.ehlo(smtp_server)
        smtp_obj.login(sender, 'citycup2018')
        smtp_obj.sendmail(sender, receivers, message.as_string())
        # print("邮件发送成功")
    except smtplib.SMTPException:
        print("Error: 无法发送邮件")
